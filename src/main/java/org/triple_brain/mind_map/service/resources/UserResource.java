package org.triple_brain.mind_map.service.resources;

import com.ovea.tadjin.util.rest.JSONMessages;
import org.codehaus.jettison.json.JSONObject;
import org.triple_brain.module.model.User;
import org.triple_brain.module.model.validator.Validators;
import org.triple_brain.module.repository.user.user.NonExistingUserException;
import org.triple_brain.module.repository.user.user.UserRepository;

import javax.annotation.security.PermitAll;
import javax.inject.Inject;
import javax.inject.Singleton;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.URI;
import java.util.Map;

import static javax.ws.rs.core.Response.Status.BAD_REQUEST;
import static org.triple_brain.module.model.json.UserJSONFields.*;
import static org.triple_brain.module.model.validator.UserValidator.validate;
import static org.triple_brain.mind_map.service.SecurityInterceptor.*;
/**
 * @author Vincent Blouin
 */

@Path("/users")
@PermitAll
@Produces(MediaType.APPLICATION_JSON)
@Singleton
public class UserResource {

    @Inject
    UserRepository userRepository;

    @GET
    @Path("/authenticate")
    public Response authenticate(@QueryParam("email") String email, @QueryParam("password") String password, @Context HttpServletRequest request) {
        try {
            User user = userRepository.findByEmail(email);
            if (user.hasPassword(password)) {
                request.getSession().setAttribute(AUTHENTICATION_ATTRIBUTE_KEY, true);
                return Response.ok().build();
            }
        } catch (NonExistingUserException e) {
            return Response.status(401).build();
        }
        return Response.status(401).build();
    }

    @POST
    @Path("/")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(JSONObject jsonUser, @Context HttpServletRequest request) throws Exception {
        User user = User.withEmail(jsonUser.optString(EMAIL, "")).firstName(jsonUser.optString(FIRST_NAME, "")).lastName(jsonUser.optString(LAST_NAME, ""))
                .password(jsonUser.optString(PASSWORD, ""));

        JSONMessages jsonMessages = new JSONMessages();
        Map<String, String> errors = Validators.validateEmail(EMAIL, user.email());
        errors.putAll(validate(user));
        errors.putAll(Validators.validatePassword(PASSWORD, jsonUser.optString(PASSWORD, ""), jsonUser.optString(PASSWORD_VERIFICATION, "")));

        if (userRepository.emailExists(jsonUser.optString(EMAIL, "")))
            errors.put(EMAIL, Validators.ALREADY_REGISTERED_EMAIL);

        if (!errors.isEmpty()) {
            for (Map.Entry<String, String> entry : errors.entrySet()) {
                jsonMessages.addFieldError(entry.getKey(), entry.getValue());
            }

            throw new WebApplicationException(Response
                    .status(BAD_REQUEST)
                    .entity(jsonMessages.toString())
                    .build());
        }

        userRepository.save(user);
        return Response.created(new URI(request.getRequestURL() + "/" + user.id())).build();
    }

}
