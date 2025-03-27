package com.romanwit.minicrm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.beans.factory.BeanCreationException;
import java.io.IOException;

@SpringBootApplication
public class MiniCrmApplication {

    public static void main(String[] args) {
        //SpringApplication.run(MiniCrmApplication.class, args);
        boolean retry = true;
        while (true) {
            try {
                SpringApplication.run(MiniCrmApplication.class, args);
                break; 
            } catch (Exception e) {
                if (e instanceof BeanCreationException && e.getMessage().contains("Connection to localhost:5432 refused") && retry) {
                    System.err.println("Failed to connect to PostgreSQL. Trying restart server...");
                    try {
                        ProcessBuilder pb = new ProcessBuilder("bash", "-c", "export LC_ALL=en_US.UTF-8 && pg_ctl -D /usr/local/var/postgresql@15 start");
                        pb.inheritIO(); 
                        Process process = pb.start();
                        int exitCode = process.waitFor();
                        if (exitCode == 0) {
                            System.out.println("PostgreSQL started successfully.");
                        } else {
                            System.err.println("Error restarting PostgreSQL. Exit code: " + exitCode);
                            break;
                        }
                    } catch (IOException | InterruptedException ex) {
                        System.err.println("Failed to restart PostgreSQL: " + ex.getMessage());
                        break;
                    }
                    retry = false; 
                    System.out.println("Repeating attempt to restart server...");
                } else {
                    System.err.println("Impossible to restart server: " + e.getMessage());
                    break;
                }
            }
        }
    }
}
