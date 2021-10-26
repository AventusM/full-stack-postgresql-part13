CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title) values ('Dan Abramov', 'https://overreacted.io/writing-resilient-components/', 'Writing Resilient Components');
insert into blogs (author, url, title) values ('Martin Fowler', 'https://martinfowler.com/articles/is-quality-worth-cost.html', 'Is High Quality Software Worth the Cost?');