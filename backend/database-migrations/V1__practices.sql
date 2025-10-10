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
    'Anteeksi', 
    'Sorry'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'easy',
    'Hauska tavata', 
    'Nice to meet you'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'easy',
    'Nähdään', 
    'See you'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'easy',
    'Ole hyvä', 
    'You are welcome'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'easy',
    'Minun nimeni on John', 
    'My name is John'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'easy',
    'Mitä kuuluu?', 
    'How are you?'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'medium',
    'Missä on juna-asema?', 
    'Where is the train station?'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'medium',
    'Opiskelen Aalto-yliopistossa', 
    'I study in Aalto University'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'medium',
    'Olen myöhässä lennoltani', 
    'I am late for my flight'
);


INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'medium',
    'Pidän ohjelmoinnista', 
    'I like programming'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'medium',
    'Tule kanssani kirjastoon', 
    'Come with me to the library'
);


INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'medium',
    'Osaan leipoa keksejä', 
    'I can bake cookies'
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
    'Haluan olla ohjelmistokehittäjä', 
    'I want to be a software developer'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'hard',
    'Halutko syödä lounasta kanssani?', 
    'Do you want to eat lunch with me?'
);


INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'hard',
    'Minulla on paras tietokone', 
    'I have the best computer'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'hard',
    'Kävelen huomenna kouluun', 
    'I will walk to school tomorrow'
);

INSERT INTO practices (difficulty, question, correct_answer)
VALUES (
    'hard',
    'Eilen satoi', 
    'Yesterday it rained'
);

