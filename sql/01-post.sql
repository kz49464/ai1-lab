create table post
(
    id      integer not null
        constraint post_pk
            primary key autoincrement,
    subject text not null,
    content text not null
);

CREATE TABLE match
(
    id      integer NOT NULL PRIMARY KEY,
    subject text NOT NULL,
    content text NOT NULL
);
