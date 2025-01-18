package com.romanwit.minicrm.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "fixed_list_values")
public class FixedListValue implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private ClientProperty property;

    @Column(nullable = false)
    private String value;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ClientProperty getProperty() {
        return property;
    }

    public void setProperty(ClientProperty property) {
        this.property = property;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
