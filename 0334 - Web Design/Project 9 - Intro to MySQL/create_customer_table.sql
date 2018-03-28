CREATE TABLE Customer (
	user_id int NOT NULL AUTO_INCREMENT,
    user_password varchar(255),
    first_name varchar(255),
    last_name varchar(255),
	address_1 varchar(255),
    address_2 varchar(255),
    city varchar(255),
    state varchar(255),
    zip_code varchar(255),
	country varchar(255),
    email varchar(255),
    home_phone varchar(255),
    cell_phone varchar(255),
    
    PRIMARY KEY(user_id)
);

CREATE TABLE Salesperson (
	salesperson_id int NOT NULL AUTO_INCREMENT,
    first_name varchar(255),
    last_name varchar(255),
	address_1 varchar(255),
    address_2 varchar(255),
    city varchar(255),
    state varchar(255),
    zip_code varchar(255),
	country varchar(255),
    email varchar(255),
    home_phone varchar(255),
    cell_phone varchar(255),
    facebook_url varchar(255),
    
    PRIMARY KEY(user_id)
);