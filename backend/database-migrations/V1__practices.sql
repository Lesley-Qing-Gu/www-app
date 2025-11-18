CREATE TABLE practices (
  id SERIAL PRIMARY KEY,
  difficulty VARCHAR(255) NOT NULL,
  question VARCHAR(255) NOT NULL,
  correct_answer VARCHAR(255) NOT NULL
);

/* CREATE TABLE user_progress (
    user_id INT PRIMARY KEY,
    current_category VARCHAR(10),  -- 'Easy', 'Medium', 'Hard'
    streak INT,
    current_practice_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
); */

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'easy',
    'Tänään on kaunis päivä', 
    'It is a beautiful day today'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'easy',
    'Nimeni on John ja pidän matematiikasta', 
    'My name is John and I like math'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'easy',
    'Nähdään myöhemmin kirjastossa', 
    'See you later at the library'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'easy',
    'Olet niin mukava ja taitava ohjelmoimaan', 
    'You are so nice and good at programming'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'easy',
    'Minun nimeni on John ja olen 20 vuotias', 
    'My name is John and I am 20 years old'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'easy',
    'Minulla on koira ja kaksi kissaa', 
    'I have a dog and two cats'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'medium',
    'Opiskelen suomea koska asun Helsingissä', 
    'I am studying Finnish because I live in Helsinki'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'medium',
    'Opiskelen Aalto-yliopistossa ja valmistun pian', 
    'I study in Aalto University and I will graduate soon'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'medium',
    'Olen myöhässä lennoltani ja olen nälkäinen', 
    'I am late for my flight and I am hungry'
);


INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'medium',
    'Pidän ohjelmoinnista ja tietokannoista', 
    'I like programming and databases'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'medium',
    'Tule kanssani kirjastoon opiskelemaan ja juttelemaan', 
    'Come with me to the library to study and talk'
);


INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'medium',
    'Osaan leipoa keksejä ja syntymäpäiväkakkuja', 
    'I can bake cookies and birthday cakes'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'hard',
    'Olen myöhässä, koska nukuin pommiin', 
    'I am late because I overslept'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'hard',
    'Haluan olla isona ohjelmistokehittäjä', 
    'I want to be a software developer when I grow up'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'hard',
    'Halutko syödä lounasta kanssani ravintolassa?', 
    'Do you want to eat lunch with me in the restaurant?'
);


INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'hard',
    'Minulla on paras ja tehokkain tietokone', 
    'I have the best and the most efficient computer'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'hard',
    'Kävelen huomenna kouluun kaverini kanssa', 
    'I will walk to school tomorrow with my friend'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'hard',
    'Eilen satoi mutta tänään paistaa aurinko', 
    'Yesterday it rained but today it is sunny'
);

