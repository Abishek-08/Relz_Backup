create database ehs_demo_dbs;

use ehs_demo_dbs;

create table user_tbl(
userId int not null primary key,
userName varchar(255),
userEmail varchar(255),
userGender varchar(255),
userPassword varchar(255),
userProfile varchar(255),
userRole varchar(255),
isActive boolean,
createdAt datetime,
updatedAt datetime
);


create table login_tbl(
loginId int not null primary key,
loginOtp varchar(255),
expiryMinutes int,
loginOtpSendTime time,
loginOtpReceiveTime time
);

create table industry_tbl(
industryId int not null primary key,
industryType varchar(255),
industryDescription varchar(255),
createdAt datetime,
updatedAt datetime
);

create table solution_tbl(
solutionId int not null primary key,
solutionType varchar(255),
solutionDescription varchar(255),
createdAt datetime,
updatedAt datetime
);

create table plan_tbl(
planId int not null primary key,
planType varchar(255),
planDuration int,
planAmount Double
);

create table individualplan_tbl(
individualPlanId int not null primary key
);

create table bundleplan_tbl(
bundlePlanId int not null primary key
);

create table subscription_tbl(
subscriptionId int not null primary key,
activateDate datetime,
expiryDate datetime
);

create table payment_tbl(
paymentId int not null primary key,
paymentType varchar(255),
paymentAmount double,
paymentDate datetime,
paymentStatus varchar(255)
);

alter table login_tbl
add user_Id int unique,
add foreign key (user_Id) references user_tbl(userId);

alter table solution_tbl
add industry_Id int,
add foreign key (industry_Id) references industry_tbl(industryId);

alter table individualplan_tbl
add plan_Id int unique,
add solution_Id int unique,
add foreign key (plan_Id) references plan_tbl(planId),
add foreign key (solution_Id) references solution_tbl(solutionId);

alter table bundleplan_tbl 
add plan_Id int unique,
add industry_Id int unique,
add foreign key (plan_Id) references plan_tbl(planId),
add foreign key (industry_Id) references industry_tbl(industryId);

create table subscription_plan_tbl(
subscription_Id int,
plan_Id int,
primary key(subscription_Id,plan_Id),
foreign key (subscription_Id) references subscription_tbl(subscriptionId),
foreign key (plan_Id) references plan_tbl(planId)
);

create table subscription_user_tbl(
subscription_Id int,
user_Id int,
primary key (subscription_Id,user_Id),
foreign key (subscription_Id) references subscription_tbl(subscriptionId),
foreign key (user_Id) references user_tbl(userId)
);

create table payment_subscription_tbl(
payment_Id int,
subscription_Id int,
primary key (payment_Id,subscription_Id),
foreign key (payment_Id) references payment_tbl(paymentId),
foreign key (subscription_Id) references subscription_tbl(subscriptionId)
);

create table payment_user_tbl(
payment_Id int,
user_Id int,
primary key (payment_Id,user_Id),
foreign key (payment_Id) references payment_tbl(paymentId),
foreign key (user_Id) references user_tbl(userId)
);
