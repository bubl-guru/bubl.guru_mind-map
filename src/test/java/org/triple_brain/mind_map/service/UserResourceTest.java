package org.triple_brain.mind_map.service;

import com.sun.jersey.api.client.ClientResponse;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.junit.Test;
import org.triple_brain.mind_map.service.utils.GraphManipulationRestTest;
import org.triple_brain.module.model.User;
import org.triple_brain.module.model.UserUris;
import org.triple_brain.module.model.json.UserJsonFields;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;

import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.*;
import static org.triple_brain.module.model.json.UserJsonFields.*;
import static org.triple_brain.module.model.validator.UserValidator.ALREADY_REGISTERED_EMAIL;
import static org.triple_brain.module.model.validator.UserValidator.USER_NAME_ALREADY_REGISTERED;

/**
 * Copyright Mozilla Public License 1.1
 */
public class UserResourceTest extends GraphManipulationRestTest {

    @Test
    public void can_authenticate_user() throws Exception {
        User rogerLamothe = User.withUsernameAndEmail(
                "roger_lamothe",
                "roger.lamothe@example.org"
        );
        JSONObject rogerLamotheAsJson = UserJsonFields.toJson(
                rogerLamothe
        );
        rogerLamotheAsJson.put(
                UserJsonFields.PASSWORD,
                DEFAULT_PASSWORD
        );
        rogerLamotheAsJson.put(
                UserJsonFields.PASSWORD_VERIFICATION,
                DEFAULT_PASSWORD
        );
        createUser(rogerLamotheAsJson);
        JSONObject loginInfo = new JSONObject()
                .put(UserJsonFields.EMAIL, "roger.lamothe@example.org")
                .put(UserJsonFields.PASSWORD, "password");
        ClientResponse response = resource
                .path("users")
                .path("session")
                .post(ClientResponse.class, loginInfo);
        assertThat(response.getStatus(), is(200));
    }

    @Test
    public void can_logout() throws Exception {
        assertTrue(isUserAuthenticated(
                authCookie
        ));
        logoutUsingCookie(authCookie);
        assertFalse(isUserAuthenticated(
                authCookie
        ));
    }

    private ClientResponse logoutUsingCookie(NewCookie cookie) {
        ClientResponse response = resource
                .path("users")
                .path("session")
                .cookie(cookie)
                .delete(ClientResponse.class);
        return response;
    }

    private boolean isUserAuthenticated(NewCookie cookie) {
        ClientResponse response = resource
                .path("users")
                .path("is_authenticated")
                .cookie(cookie)
                .get(ClientResponse.class);
        JSONObject jsonResponse = response.getEntity(JSONObject.class);
        try{
            return jsonResponse.getBoolean("is_authenticated");
        }catch(JSONException e){
            throw new RuntimeException(e);
        }
    }

    @Test
    public void authentication_returns_user_as_json() throws Exception {
        JSONObject user = userUtils.validForCreation();
        createUser(user);
        JSONObject loginInfo = new JSONObject()
                .put(
                        UserJsonFields.EMAIL,
                        user.getString(UserJsonFields.EMAIL)
                )
                .put(UserJsonFields.PASSWORD, DEFAULT_PASSWORD);
        ClientResponse response = resource
                .path("users")
                .path("session")
                .post(ClientResponse.class, loginInfo);
        JSONObject userFromResponse = response.getEntity(JSONObject.class);
        String originalUserUsername = user.getString(UserJsonFields.USER_NAME);
        assertThat(
                userFromResponse.getString(USER_NAME),
                is(originalUserUsername)
        );
    }

    @Test
    public void can_create_user() throws Exception {
        JSONObject user = userUtils.validForCreation();
        assertFalse(userUtils.emailExists(
                user.getString(EMAIL)
        ));
        createUser(
                user
        );
        assertTrue(
                userUtils.emailExists(
                        user.getString(EMAIL)
                )
        );
    }

    @Test
    public void user_is_authenticated_after_creation()throws JSONException{
        logoutUsingCookie(authCookie);
        assertFalse(isUserAuthenticated(
                authCookie
        ));
        JSONObject validForCreation = userUtils.validForCreation();
        createUser(validForCreation);
        assertTrue(isUserAuthenticated(
                authCookie
        ));
    }

    @Test
    public void creating_a_user_returns_corrects_response() throws Exception {
        JSONObject jsonUser = userUtils.validForCreation();
        ClientResponse response = createUser(
                jsonUser
        );
        assertThat(response.getStatus(), is(201));
        jsonUser = authenticate(jsonUser);
        String username = jsonUser.getString(UserJsonFields.USER_NAME);
        assertThat(
                response.getHeaders().get("Location").get(0),
                is(BASE_URI + "users/" + username)
        );
    }

    @Test
    public void when_creating_a_user_a_mind_map_is_created_for_him() throws Exception {
        JSONObject validUser = userUtils.validForCreation();
        User user = User.withUsernameAndEmail(
                validUser.getString(USER_NAME),
                validUser.getString(UserJsonFields.EMAIL)
        );
        assertFalse(
                graphElementWithIdExistsInCurrentGraph(
                        new UserUris(user).defaultVertexUri()
                )
        );
        createUser(validUser);
        assertTrue(
                graphElementWithIdExistsInCurrentGraph(
                        new UserUris(user).defaultVertexUri()
                )
        );
    }

    private ClientResponse createUser(JSONObject user) {
        return resource
                .path("users/")
                .type(MediaType.APPLICATION_JSON)
                .cookie(authCookie)
                .post(ClientResponse.class, user);
    }

    @Test
    public void can_get_current_authenticated_user() throws Exception {
        JSONObject user = createUserWithUsername("roger_lamothe");
        authenticate(user);
        ClientResponse response = resource
                .path("users")
                .path("session")
                .cookie(authCookie)
                .get(ClientResponse.class);
        JSONObject userFromResponse = response.getEntity(JSONObject.class);
        assertThat(userFromResponse.getString(USER_NAME), is("roger_lamothe"));
    }

    @Test
    public void getting_current_authenticated_user_without_being_authenticated_returns_the_forbidden_status() throws Exception {
        ClientResponse response = resource
                .path("users")
                .path("session")
                .get(ClientResponse.class);
        assertThat(response.getStatus(), is(Response.Status.FORBIDDEN.getStatusCode()));
    }


    @Test
    public void cant_register_same_email_twice() throws Exception {
        createUserWithEmail("roger.lamothe@example.org");
        JSONObject jsonUser = userUtils.validForCreation().put(EMAIL, "roger.lamothe@example.org");
        ClientResponse response = resource
                .path("users/")
                .type("application/json")
                .post(ClientResponse.class, jsonUser);
        assertThat(response.getStatus(), is(400));
        JSONArray errors = response.getEntity(JSONArray.class);
        assertThat(errors.length(), greaterThan(0));
        assertThat(errors.getJSONObject(0).get("field").toString(), is(EMAIL));
        assertThat(errors.getJSONObject(0).get("reason").toString(), is(ALREADY_REGISTERED_EMAIL));
    }

    @Test
    public void cant_register_same_user_name_twice() throws Exception {
        createUserWithUsername("roger_lamothe");
        JSONObject jsonUser = userUtils.validForCreation().put(USER_NAME, "roger_lamothe");
        ClientResponse response = resource
                .path("users/")
                .type("application/json")
                .post(ClientResponse.class, jsonUser);
        assertThat(response.getStatus(), is(400));
        JSONArray errors = response.getEntity(JSONArray.class);
        assertThat(errors.length(), greaterThan(0));
        assertThat(errors.getJSONObject(0).get("field").toString(), is(USER_NAME));
        assertThat(errors.getJSONObject(0).get("reason").toString(), is(USER_NAME_ALREADY_REGISTERED));
    }

    @Test
    public void returned_user_creation_error_messages_are_in_the_right_order() throws Exception {
        JSONObject jsonUser = new JSONObject();
        jsonUser.put(EMAIL, "");
        jsonUser.put(USER_NAME, "");
        jsonUser.put(PASSWORD, "pass");
        jsonUser.put(PASSWORD_VERIFICATION, "");
        ClientResponse response = resource
                .path("users/")
                .type("application/json")
                .cookie(authCookie)
                .post(ClientResponse.class, jsonUser);
        JSONArray errors = response.getEntity(JSONArray.class);
        assertThat(errors.getJSONObject(0).get("field").toString(), is(EMAIL));
        assertThat(errors.getJSONObject(1).get("field").toString(), is(USER_NAME));
        assertThat(errors.getJSONObject(2).get("field").toString(), is(PASSWORD));
    }

    private void createUserWithEmail(String email) throws Exception {
        JSONObject user = userUtils.validForCreation();
        user.put(UserJsonFields.EMAIL, email);
        createUser(user);
    }

    private JSONObject createUserWithUsername(String username) throws Exception {
        JSONObject user = userUtils.validForCreation();
        user.put(UserJsonFields.USER_NAME, username);
        createUser(user);
        return user;
    }
}
