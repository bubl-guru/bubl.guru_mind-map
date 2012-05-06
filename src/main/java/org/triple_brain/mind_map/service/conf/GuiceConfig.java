package org.triple_brain.mind_map.service.conf;

import com.google.inject.Guice;
import com.google.inject.Injector;
import com.google.inject.matcher.Matchers;
import com.google.inject.name.Names;
import com.google.inject.servlet.GuiceServletContextListener;
import com.sun.jersey.guice.JerseyServletModule;
import com.sun.jersey.guice.spi.container.servlet.GuiceContainer;
import org.triple_brain.graphmanipulator.jena.JenaConnection;
import org.triple_brain.mind_map.service.SecurityInterceptor;
import org.triple_brain.mind_map.service.resources.*;
import org.triple_brain.module.repository.user.UserRepository;
import org.triple_brain.module.repository_sql.SQLModule;
import org.triple_brain.module.repository_sql.SQLUserRepository;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;
import javax.ws.rs.Path;

import static com.google.inject.jndi.JndiIntegration.fromJndi;

/**
 * Copyright Mozilla Public License 1.1
 */
public class GuiceConfig extends GuiceServletContextListener {

    @Override
    protected Injector getInjector() {
        return Guice.createInjector(new JerseyServletModule() {
            @Override
            protected void configureServlets() {
                bind(Context.class).to(InitialContext.class);
                SecurityInterceptor securityInterceptor = new SecurityInterceptor();
                requestInjection(securityInterceptor);

                bindInterceptor(Matchers.any(), Matchers.annotatedWith(Path.class),
                        securityInterceptor);
                install(new SQLModule());
                bind(UserRepository.class).to(SQLUserRepository.class);
                bind(DrawnGraphResource.class);
                bind(GraphResource.class);
                bind(VertexResource.class);
                bind(EdgeResource.class);
                bind(UserResource.class);
                serve("/service/*").with(GuiceContainer.class);

                bind(DataSource.class)
                        .annotatedWith(Names.named("nonRdfDb"))
                        .toProvider(fromJndi(DataSource.class, "jdbc/nonRdfTripleBrainDB"));

                requestStaticInjection(JenaConnection.class);

                bind(DataSource.class)
                        .annotatedWith(Names.named("jenaDB"))
                        .toProvider(fromJndi(DataSource.class, "jdbc/jenaTripleBrainDB"));

                bind(String.class)
                        .annotatedWith(Names.named("jenaDatabaseTypeName"))
                        .toProvider(fromJndi(String.class, "jdbc/jenaTripleBrainDBTypeName"));
            }
        });
    }
}
