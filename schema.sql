create database db1 default charset=utf8;
create user 'user1'@'localhost' identified by 'password';
grant all on db1.* to 'user1'@'localhost';
-- set password for 'user1'@'localhost' = password('');

use db1;

create table users (
	id				serial,
	email			nvarchar(255),
	password		 varchar(2047)
);

insert into users(email, password)
	values('email@email.com', sha2('password', 256));
