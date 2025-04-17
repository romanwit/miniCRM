package com.romanwit.minicrm.dto;

public class UserResponse {

    private Long id;
    private String Username;
    private Long RoleId;

    public UserResponse() {
    }

    public UserResponse(Long id, String Username, Long RoleId) {
        this.id = id;
        this.Username = Username;
        this.RoleId = RoleId;
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

    public Long getRoleId() {
        return RoleId;
    }

    public void setRoleId(Long RoleId) {
        this.RoleId = RoleId;
    }
}
