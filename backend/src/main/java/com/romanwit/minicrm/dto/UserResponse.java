package com.romanwit.minicrm.dto;

public class UserResponse {

    private Long id;
    private String Username;

    public UserResponse() {
    }

    public UserResponse(Long id, String Username) {
        this.id = id;
        this.Username = Username;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return Username;
    }

    public void setUsername(String Username) {
        this.Username = Username;
    }

}
