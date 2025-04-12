package com.romanwit.minicrm.dto;

public class UserDto {

    private String Username;
    private String Password;
    private Long Role;

    public UserDto() {
    }

    public UserDto(String Username, String Password, Long Role) {
        this.Username = Username;
        this.Password = Password;
        this.Role = Role;
    }

    public String getUsername() {
        return Username;
    }

    public void setUsername(String Username) {
        this.Username = Username;
    }

    public String getPassword() {
        return Password;
    }

    public void setPassword(String password) {
        this.Password = password;
    }

    public Long getRole() {
        return Role;
    }

    public void setRole(Long role) {
        this.Role = role;
    }

}
