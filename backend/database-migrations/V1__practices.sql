-- ====================================
-- RESET
-- ====================================
DROP TABLE IF EXISTS practices_a;
DROP TABLE IF EXISTS practices_b;

-- ====================================
-- A MODE TABLE
-- ====================================
CREATE TABLE practices_a (
  id SERIAL PRIMARY KEY,
  difficulty VARCHAR(255) NOT NULL,
  question VARCHAR(255) NOT NULL,
  correct_answer VARCHAR(255) NOT NULL
);

-- ========== A MODE QUESTIONS ==========

-- Easy (A1–A4)
INSERT INTO practices_a (difficulty, question, correct_answer) VALUES
('easy', 'Hei.', 'Hi.');

INSERT INTO practices_a (difficulty, question, correct_answer) VALUES
('easy', 'Kiitos.', 'Thank you.');

INSERT INTO practices_a (difficulty, question, correct_answer) VALUES
('easy', 'Ole hyvä.', 'You''re welcome.');

INSERT INTO practices_a (difficulty, question, correct_answer) VALUES
('easy', 'Anteeksi.', 'Sorry.');

-- Medium (A5–A7)
INSERT INTO practices_a (difficulty, question, correct_answer) VALUES
('medium', 'Minä juon vettä.', 'I drink water.');

INSERT INTO practices_a (difficulty, question, correct_answer) VALUES
('medium', 'Minä syön leipää.', 'I eat bread.');

INSERT INTO practices_a (difficulty, question, correct_answer) VALUES
('medium', 'Minä olen kotona.', 'I am at home.');

-- Hard (A8–A10)
INSERT INTO practices_a (difficulty, question, correct_answer) VALUES
('hard', 'Minä juon vettä, koska olen janoinen.', 'I drink water because I am thirsty.');

INSERT INTO practices_a (difficulty, question, correct_answer) VALUES
('hard', 'Minä syön leipää, kun herään.', 'I eat bread when I wake up.');

INSERT INTO practices_a (difficulty, question, correct_answer) VALUES
('hard', 'Minä olen kotona, koska sataa.', 'I am at home because it is raining.');



-- ====================================
-- B MODE TABLE
-- ====================================
CREATE TABLE practices_b (
  id SERIAL PRIMARY KEY,
  difficulty VARCHAR(255) NOT NULL,
  question VARCHAR(255) NOT NULL,
  correct_answer VARCHAR(255) NOT NULL
);

-- ========== B MODE QUESTIONS ==========

-- Easy (B1–B4)
INSERT INTO practices_b (difficulty, question, correct_answer) VALUES
('easy', 'Moi.', 'Hello.');

INSERT INTO practices_b (difficulty, question, correct_answer) VALUES
('easy', 'Nähdään.', 'See you.');

INSERT INTO practices_b (difficulty, question, correct_answer) VALUES
('easy', 'Hyvää iltaa.', 'Good evening.');

INSERT INTO practices_b (difficulty, question, correct_answer) VALUES
('easy', 'Huomenta.', 'Morning.');

-- Medium (B5–B7)
INSERT INTO practices_b (difficulty, question, correct_answer) VALUES
('medium', 'Minä avaan oven pian.', 'I open the door soon.');

INSERT INTO practices_b (difficulty, question, correct_answer) VALUES
('medium', 'Minä suljen ikkunan täällä.', 'I close the window here.');

INSERT INTO practices_b (difficulty, question, correct_answer) VALUES
('medium', 'Minä istun puistossa nyt.', 'I sit in the park now.');

-- Hard (B8–B10)
INSERT INTO practices_b (difficulty, question, correct_answer) VALUES
('hard', 'Minä avaan oven, vaikka on valoisaa.', 'I open the door even though it''s bright.');

INSERT INTO practices_b (difficulty, question, correct_answer) VALUES
('hard', 'Minä suljen ikkunan, jos tuulee.', 'I close the window if it''s windy.');

INSERT INTO practices_b (difficulty, question, correct_answer) VALUES
('hard', 'Minä istun puistossa, ennen kuin lähden.', 'I sit in the park before I leave.');

-- Easy (B11–B16)
INSERT INTO practices_b (difficulty, question, correct_answer) VALUES
('easy', 'Avaan ikkunan.', 'Open the window.');

INSERT INTO practices_b (difficulty, question, correct_answer) VALUES
('easy', 'Suljen oven.', 'Close the door.');

INSERT INTO practices_b (difficulty, question, correct_answer) VALUES
('easy', 'Suljen puiston.', 'Close the park.');

INSERT INTO practices_b (difficulty, question, correct_answer) VALUES
('easy', 'Jos tuulee.', 'If it''s windy.');

INSERT INTO practices_b (difficulty, question, correct_answer) VALUES
('easy', 'On valoisaa.', 'It''s bright.');

INSERT INTO practices_b (difficulty, question, correct_answer) VALUES
('easy', 'Ennen kuin lähden.', 'Before I leave.');

-- Hard (B17–B20)
INSERT INTO practices_b (difficulty, question, correct_answer) VALUES
('hard', 'Minä avaan oven, jos tuulee.', 'I open the door if it''s windy.');

INSERT INTO practices_b (difficulty, question, correct_answer) VALUES
('hard', 'Minä suljen ikkunan, vaikka on valoisaa.', 'I close the window even though it''s bright.');

INSERT INTO practices_b (difficulty, question, correct_answer) VALUES
('hard', 'Minä istun puistossa, vaikka tuulee.', 'I sit in the park even though it''s windy.');

INSERT INTO practices_b (difficulty, question, correct_answer) VALUES
('hard', 'Minä avaan oven, ennen kuin lähden.', 'I open the door before I leave.');
