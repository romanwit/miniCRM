package com.romanwit.minicrm.model;

import jakarta.persistence.*;
import java.io.Serializable;

import lombok.Data;

@Entity
@Table(name = "fixed_list_values")
@Data
public class FixedListValue implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private CustomerProperty property;

    @Column(nullable = false)
    private String value;

}
