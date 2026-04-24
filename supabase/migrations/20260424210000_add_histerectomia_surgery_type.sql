-- ============================================================
-- Migration: add_histerectomia_surgery_type
-- Adiciona tipo de cirurgia Histerectomia com perguntas específicas
-- ============================================================

-- 1. Criar o tipo de cirurgia "Histerectomia"
INSERT INTO surgery_types (id, name, description, expected_recovery_days, is_active)
VALUES (
  gen_random_uuid(),
  'Histerectomia',
  'Remoção cirúrgica do útero',
  14,
  true
);

-- 2. Criar novas perguntas exclusivas da Histerectomia

INSERT INTO questions (id, text, input_type, is_active, metadata)
VALUES (gen_random_uuid(), 'Sua urina está avermelhada?', 'boolean', true, '{}');

INSERT INTO questions (id, text, input_type, is_active, metadata)
VALUES (gen_random_uuid(), 'Teve sangramento transvaginal?', 'boolean', true, '{}');

INSERT INTO questions (id, text, input_type, is_active, metadata)
VALUES (gen_random_uuid(), 'Teve corrimento vaginal?', 'boolean', true, '{}');

INSERT INTO questions (id, text, input_type, is_active, metadata)
VALUES (gen_random_uuid(), 'O corrimento tem odor?', 'boolean', true, 
  '{"depends_on_value": "true", "depends_on_question_text": "Teve corrimento vaginal?"}');

INSERT INTO questions (id, text, input_type, is_active, metadata)
VALUES (gen_random_uuid(), 'O corrimento tem aspecto purulento?', 'boolean', true, 
  '{"depends_on_value": "true", "depends_on_question_text": "Teve corrimento vaginal?"}');

-- 3. Criar opções (Sim/Não) para as novas perguntas

INSERT INTO question_options (id, question_id, label, value, is_abnormal, display_order)
SELECT gen_random_uuid(), q.id, 'Sim', 'true', true, 1
FROM questions q WHERE q.text = 'Sua urina está avermelhada?';
INSERT INTO question_options (id, question_id, label, value, is_abnormal, display_order)
SELECT gen_random_uuid(), q.id, 'Não', 'false', false, 2
FROM questions q WHERE q.text = 'Sua urina está avermelhada?';

INSERT INTO question_options (id, question_id, label, value, is_abnormal, display_order)
SELECT gen_random_uuid(), q.id, 'Sim', 'true', true, 1
FROM questions q WHERE q.text = 'Teve sangramento transvaginal?';
INSERT INTO question_options (id, question_id, label, value, is_abnormal, display_order)
SELECT gen_random_uuid(), q.id, 'Não', 'false', false, 2
FROM questions q WHERE q.text = 'Teve sangramento transvaginal?';

INSERT INTO question_options (id, question_id, label, value, is_abnormal, display_order)
SELECT gen_random_uuid(), q.id, 'Sim', 'true', true, 1
FROM questions q WHERE q.text = 'Teve corrimento vaginal?';
INSERT INTO question_options (id, question_id, label, value, is_abnormal, display_order)
SELECT gen_random_uuid(), q.id, 'Não', 'false', false, 2
FROM questions q WHERE q.text = 'Teve corrimento vaginal?';

INSERT INTO question_options (id, question_id, label, value, is_abnormal, display_order)
SELECT gen_random_uuid(), q.id, 'Sim', 'true', true, 1
FROM questions q WHERE q.text = 'O corrimento tem odor?';
INSERT INTO question_options (id, question_id, label, value, is_abnormal, display_order)
SELECT gen_random_uuid(), q.id, 'Não', 'false', false, 2
FROM questions q WHERE q.text = 'O corrimento tem odor?';

INSERT INTO question_options (id, question_id, label, value, is_abnormal, display_order)
SELECT gen_random_uuid(), q.id, 'Sim', 'true', true, 1
FROM questions q WHERE q.text = 'O corrimento tem aspecto purulento?';
INSERT INTO question_options (id, question_id, label, value, is_abnormal, display_order)
SELECT gen_random_uuid(), q.id, 'Não', 'false', false, 2
FROM questions q WHERE q.text = 'O corrimento tem aspecto purulento?';

-- 4. Vincular perguntas existentes (reutilizadas) ao tipo Histerectomia

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 1, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'Como está sua dor hoje?';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 2, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'A DOR ESTÁ:';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 3, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'A dor impede movimentos normais?';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 4, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'A dor melhora com analgésicos?';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 5, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'Teve febre nas últimas 24h (acima de 37,8ºC)?';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 6, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'Sente o coração acelerado?';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 7, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'A ferida está vermelha?';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 8, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'A ferida está inchada?';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 9, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'A ferida está dolorosa?';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 10, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'Há alguma secreção saindo da ferida?';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 11, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'Como é a secreção?';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 12, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'Está conseguindo se alimentar?';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 13, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'Teve náuseas ou vômitos?';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 14, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'Evacuou normalmente?';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 15, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text LIKE 'Está sentindo%falta de ar%';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 16, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'Dor no peito?';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 17, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'Dor ou inchaço em APENAS UMA perna?';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 18, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'Está andando normalmente?';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 19, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'Precisou de ajuda extra hoje?';

-- 5. Vincular perguntas NOVAS ao tipo Histerectomia

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 20, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'Sua urina está avermelhada?';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 21, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'Teve sangramento transvaginal?';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 22, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'Teve corrimento vaginal?';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 23, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'O corrimento tem odor?';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 24, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'O corrimento tem aspecto purulento?';

INSERT INTO surgery_questions (id, surgery_type_id, question_id, display_order, is_active)
SELECT gen_random_uuid(), st.id, q.id, 25, true
FROM surgery_types st, questions q
WHERE st.name = 'Histerectomia' AND q.text = 'Algo mais que gostaria de relatar?';
