package com.romanwit.minicrm.repository;

import com.romanwit.minicrm.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {
    //@Query("SELECT c FROM Client c LEFT JOIN FETCH c.properties")
    //List<Client> findAllWithProperties();
}

