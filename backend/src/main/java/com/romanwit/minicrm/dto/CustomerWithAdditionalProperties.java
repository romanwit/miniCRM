package com.romanwit.minicrm.dto;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import com.romanwit.minicrm.model.PropertyType;

public class CustomerWithAdditionalProperties {
    
    private long id;
    private String name;
    private LocalDateTime registrationDate;
    private String email;
    private String phone;
    private HashMap<PropertyType, Object> properties;

    public CustomerWithAdditionalProperties() {}

    public CustomerWithAdditionalProperties(long id, String name, LocalDateTime registrationDate, String email, String phone, HashMap<PropertyType, Object> properties) {
        this.id = id;
        this.name = name;
        this.registrationDate = registrationDate;
        this.email = email;
        this.phone = phone;
        this.properties = properties;
    }


	public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public HashMap<PropertyType, Object> getProperties() {
        return properties;
    }

    public void setProperties(HashMap<PropertyType, Object> properties) {
        this.properties = properties;
    }

    public void addProperty(PropertyType propertyType, Object value) {
        if (properties == null) {
            properties = new HashMap<>();
        }
        properties.put(propertyType, value);
    }

    public Object getProperty(PropertyType propertyType) {
        if (properties != null) {
            return properties.get(propertyType);
        }
        return null;
    }

    @Override
    public String toString() {
        return "CustomerWithAdditionalProperties{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", registrationDate=" + registrationDate +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", properties=" + properties +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        CustomerWithAdditionalProperties that = (CustomerWithAdditionalProperties) o;

        if (id != that.id) return false;
        if (!name.equals(that.name)) return false;
        if (!registrationDate.equals(that.registrationDate)) return false;
        if (!email.equals(that.email)) return false;
        if (!phone.equals(that.phone)) return false;
        return properties.equals(that.properties);
    }

    @Override
    public int hashCode() {
        int result = (int) (id ^ (id >>> 32));
        result = 31 * result + name.hashCode();
        result = 31 * result + registrationDate.hashCode();
        result = 31 * result + email.hashCode();
        result = 31 * result + phone.hashCode();
        result = 31 * result + properties.hashCode();
        return result;
    }
}
