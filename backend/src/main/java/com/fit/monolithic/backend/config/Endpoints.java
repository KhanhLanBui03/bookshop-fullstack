package com.fit.monolithic.backend.config;

public class Endpoints {
    public static final String[] PUBLISH_GET_ENDPOINTS = {
            "/api/v1/books/**",
            "/api/v1/publishers/**"
    };
    public static final String[] PUBLISH_POST_ENDPOINTS = {
            "/api/v1/publishers/**"
    };

    public static final String[] ADMIN_POST_ENDPOINTS = {
            "/api/v1/books/**",
            "/api/v1/authors/**",
            "/api/v1/category/**",
    };
    public static final String[] ADMIN_DELETE_ENDPOINTS = {
            "/api/v1/books/**",
            "/api/v1/authors/**",
            "/api/v1/category/**",
    };
    public static final String[] ADMIN_PUT_ENDPOINTS = {
            "/api/v1/books/**",
            "/api/v1/authors/**",
            "/api/v1/category/**",
    };

}
