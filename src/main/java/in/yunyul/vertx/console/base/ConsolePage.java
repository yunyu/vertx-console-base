package in.yunyul.vertx.console.base;

import io.vertx.core.Vertx;
import io.vertx.ext.web.Router;

public interface ConsolePage {
    /**
     * Sets up and mounts the supporting endpoints for the page.
     *
     * @param vertx    the Vert.x instance
     * @param router   the router to mount endpoints on
     * @param basePath the base path to mount the endpoints under
     */
    void mount(Vertx vertx, Router router, String basePath);

    /**
     * Provides the file name of the script to inject on the client,
     * relative to {@link WebConsoleRegistry#CONSOLE_ROOT}.
     * Should start with a forward slash, e.g. '/js/mypage.js'.
     *
     * @return the script file name
     */
    String getLoaderFileName();
}
