package com.romanwit.minicrm.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "client_properties")
public class CustomerProperty implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Customer client;

    @ManyToOne
    @JoinColumn(name = "property_type_id", nullable = false)
    private PropertyType propertyType;

    @Column
    private String value;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Customer getClient() {
        return client;
    }

    public void setClient(Customer client) {
        this.client = client;
    }

    public PropertyType getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(PropertyType propertyType) {
        this.propertyType = propertyType;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
