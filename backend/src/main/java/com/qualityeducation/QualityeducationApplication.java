package com.qualityeducation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories(basePackages = {
		"com.qualityeducation.repository",
})
@EnableMongoAuditing
public class QualityeducationApplication {

	public static void main(String[] args) {
		SpringApplication.run(QualityeducationApplication.class, args);
	}

}