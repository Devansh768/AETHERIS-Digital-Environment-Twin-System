package com.digitaltwin.environment.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:jdbc:mysql://localhost:3306/digital_twin_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}")
    private String mysqlUrl;

    @Value("${spring.datasource.username:root}")
    private String mysqlUser;

    @Value("${spring.datasource.password:root}")
    private String mysqlPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        // Attempt connecting to MySQL
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(mysqlUrl, mysqlUser, mysqlPassword)) {
                log.info("==================================================================");
                log.info(">>> SUCCESS: Connected to MySQL Database (digital_twin_db)");
                log.info("==================================================================");
                return DataSourceBuilder.create()
                        .driverClassName("com.mysql.cj.jdbc.Driver")
                        .url(mysqlUrl)
                        .username(mysqlUser)
                        .password(mysqlPassword)
                        .build();
            }
        } catch (Exception e) {
            log.warn("==================================================================");
            log.warn(">>> NOTICE: Could not connect to MySQL Server ({})", e.getMessage());
            log.warn(">>> Booting with high-performance Embedded Database fallback (H2).");
            log.warn(">>> To connect to MySQL, configure 'spring.datasource.password' in application.properties or run schema.sql.");
            log.warn("==================================================================");

            return DataSourceBuilder.create()
                    .driverClassName("org.h2.Driver")
                    .url("jdbc:h2:mem:digital_twin_db;DB_CLOSE_DELAY=-1;MODE=MySQL")
                    .username("sa")
                    .password("")
                    .build();
        }
    }
}
