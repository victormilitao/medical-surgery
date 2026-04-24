-- Clean duplicates and re-seed with unique data

-- Clear all duplicated data
TRUNCATE surgery_type_signs;
TRUNCATE surgery_type_phase_guidelines;

-- COLECISTECTOMIA Signs
INSERT INTO surgery_type_signs (surgery_type_id, category, description, display_order)
SELECT st.id, 'alert', 'Icterícia (pele ou olhos amarelados)', 1 FROM surgery_types st WHERE st.name LIKE 'Colecistectomia%'
UNION ALL SELECT st.id, 'alert', 'Fezes esbranquiçadas (acolia fecal)', 2 FROM surgery_types st WHERE st.name LIKE 'Colecistectomia%'
UNION ALL SELECT st.id, 'alert', 'Dor abdominal intensa que não melhora com analgésicos', 3 FROM surgery_types st WHERE st.name LIKE 'Colecistectomia%'
UNION ALL SELECT st.id, 'alert', 'Vômitos persistentes', 4 FROM surgery_types st WHERE st.name LIKE 'Colecistectomia%'
UNION ALL SELECT st.id, 'alert', 'Febre (acima de 37,8°C)', 5 FROM surgery_types st WHERE st.name LIKE 'Colecistectomia%'
UNION ALL SELECT st.id, 'alert', 'Sangramento intenso pela ferida operatória', 6 FROM surgery_types st WHERE st.name LIKE 'Colecistectomia%'
UNION ALL SELECT st.id, 'alert', 'Saída de conteúdo purulento da ferida operatória', 7 FROM surgery_types st WHERE st.name LIKE 'Colecistectomia%'
UNION ALL SELECT st.id, 'attention', 'Dor abdominal moderada', 1 FROM surgery_types st WHERE st.name LIKE 'Colecistectomia%'
UNION ALL SELECT st.id, 'attention', 'Hiperemia (vermelhidão) na ferida operatória', 2 FROM surgery_types st WHERE st.name LIKE 'Colecistectomia%'
UNION ALL SELECT st.id, 'attention', 'Saída de líquido claro e sem odor da ferida operatória', 3 FROM surgery_types st WHERE st.name LIKE 'Colecistectomia%'
UNION ALL SELECT st.id, 'normal', 'Dor leve nos ombros nos primeiros dias (gás da cirurgia)', 1 FROM surgery_types st WHERE st.name LIKE 'Colecistectomia%'
UNION ALL SELECT st.id, 'normal', 'Dor abdominal leve que melhora com analgésicos comuns', 2 FROM surgery_types st WHERE st.name LIKE 'Colecistectomia%'
UNION ALL SELECT st.id, 'normal', 'Náuseas leves nos primeiros dias', 3 FROM surgery_types st WHERE st.name LIKE 'Colecistectomia%'
UNION ALL SELECT st.id, 'normal', 'Sensação de dormência na ferida operatória', 4 FROM surgery_types st WHERE st.name LIKE 'Colecistectomia%';

-- COLECISTECTOMIA Phase Guidelines
INSERT INTO surgery_type_phase_guidelines (surgery_type_id, phase_start_day, phase_end_day, phase_title, phase_subtitle, items, highlight_text, display_order)
SELECT st.id, 0, 3, 'Dias 0 a 3 – Adaptação Inicial', 'Seu corpo está se ajustando à cirurgia.',
  '["Descanse, mas não fique o tempo todo deitado.", "Caminhe pequenas distâncias várias vezes ao dia.", "Dor nos ombros pode ocorrer (gás da cirurgia).", "Náuseas leves podem acontecer."]'::jsonb,
  'O mais importante agora é descanso ativo e observação.', 1
FROM surgery_types st WHERE st.name LIKE 'Colecistectomia%'
UNION ALL
SELECT st.id, 4, 7, 'Dias 4 a 7 – Recuperação Progressiva', 'A cada dia, você deve se sentir um pouco melhor.',
  '["A dor tende a diminuir.", "A alimentação fica mais fácil.", "A mobilidade melhora."]'::jsonb,
  'Se algo estiver piorando, não ignore — avise pelo aplicativo.', 2
FROM surgery_types st WHERE st.name LIKE 'Colecistectomia%'
UNION ALL
SELECT st.id, 8, 14, 'Dias 8 a 14 – Consolidação da Recuperação', 'Você está entrando na fase final da recuperação inicial.',
  '["Retorno gradual às atividades habituais.", "Menor necessidade de analgésicos.", "Feridas em processo de cicatrização."]'::jsonb,
  'Este período prepara você para o retorno presencial.', 3
FROM surgery_types st WHERE st.name LIKE 'Colecistectomia%';

-- HISTERECTOMIA Signs
INSERT INTO surgery_type_signs (surgery_type_id, category, description, display_order)
SELECT st.id, 'alert', 'Ausência de diurese', 1 FROM surgery_types st WHERE st.name = 'Histerectomia'
UNION ALL SELECT st.id, 'alert', 'Urina vermelha', 2 FROM surgery_types st WHERE st.name = 'Histerectomia'
UNION ALL SELECT st.id, 'alert', 'Sangramento vaginal intenso', 3 FROM surgery_types st WHERE st.name = 'Histerectomia'
UNION ALL SELECT st.id, 'alert', 'Corrimento vaginal com odor', 4 FROM surgery_types st WHERE st.name = 'Histerectomia'
UNION ALL SELECT st.id, 'alert', 'Dor abdominal intensa', 5 FROM surgery_types st WHERE st.name = 'Histerectomia'
UNION ALL SELECT st.id, 'alert', 'Vômitos persistentes', 6 FROM surgery_types st WHERE st.name = 'Histerectomia'
UNION ALL SELECT st.id, 'alert', 'Febre', 7 FROM surgery_types st WHERE st.name = 'Histerectomia'
UNION ALL SELECT st.id, 'alert', 'Dor e edema em membro inferior, principalmente se assimétrico', 8 FROM surgery_types st WHERE st.name = 'Histerectomia'
UNION ALL SELECT st.id, 'alert', 'Saída de conteúdo purulento de ferida operatória', 9 FROM surgery_types st WHERE st.name = 'Histerectomia'
UNION ALL SELECT st.id, 'alert', 'Sangramento intenso por ferida operatória', 10 FROM surgery_types st WHERE st.name = 'Histerectomia'
UNION ALL SELECT st.id, 'attention', 'Urina alaranjada', 1 FROM surgery_types st WHERE st.name = 'Histerectomia'
UNION ALL SELECT st.id, 'attention', 'Dor abdominal moderada', 2 FROM surgery_types st WHERE st.name = 'Histerectomia'
UNION ALL SELECT st.id, 'attention', 'Hiperemia em ferida operatória', 3 FROM surgery_types st WHERE st.name = 'Histerectomia'
UNION ALL SELECT st.id, 'attention', 'Saída de líquido aspecto claro e sem odor de ferida operatória', 4 FROM surgery_types st WHERE st.name = 'Histerectomia'
UNION ALL SELECT st.id, 'normal', 'Sangramento vaginal discreto nos primeiros dias', 1 FROM surgery_types st WHERE st.name = 'Histerectomia'
UNION ALL SELECT st.id, 'normal', 'Dor abdominal leve a moderada que melhora com analgésicos comuns', 2 FROM surgery_types st WHERE st.name = 'Histerectomia'
UNION ALL SELECT st.id, 'normal', 'Sensação de dormência em ferida operatória', 3 FROM surgery_types st WHERE st.name = 'Histerectomia';

-- HISTERECTOMIA Phase Guidelines
INSERT INTO surgery_type_phase_guidelines (surgery_type_id, phase_start_day, phase_end_day, phase_title, phase_subtitle, items, highlight_text, display_order)
SELECT st.id, 1, 1, '1º PO', 'Primeiro dia após a cirurgia – período de observação.',
  '["Dor abdominal leve a moderada, com melhora com uso de analgésicos simples", "Diurese espontânea após retirada de SVD", "Sangramento vaginal discreto", "Deambula sem auxílio", "Presença de fome", "Flatos presentes"]'::jsonb,
  'O primeiro dia é fundamental para observação. Comunique qualquer alteração.', 1
FROM surgery_types st WHERE st.name = 'Histerectomia'
UNION ALL
SELECT st.id, 2, 5, '2º ao 5º PO', 'Recuperação progressiva – você deve sentir melhora gradual.',
  '["Dor abdominal leve a moderada, em curva de melhora no decorrer dos dias", "Diurese clara, sem sinais de sangramentos", "Sangramento vaginal discreto ou ausente", "Deambula sem auxílio", "Presença de fome", "Flatos e evacuações presentes", "Ferida operatória limpa e seca"]'::jsonb,
  'Você deve sentir melhora gradual a cada dia.', 2
FROM surgery_types st WHERE st.name = 'Histerectomia'
UNION ALL
SELECT st.id, 6, 14, '5º ao 14º PO', 'Fase de consolidação da recuperação.',
  '["Dor leve, sem necessidade de uso de analgésicos de horário", "Diurese clara, sem sinais de sangramentos", "Sangramento vaginal ausente", "Deambula sem auxílio", "Presença de fome", "Flatos e evacuações presentes", "Ferida operatória limpa e seca"]'::jsonb,
  'A dor deve estar bem controlada nesta fase.', 3
FROM surgery_types st WHERE st.name = 'Histerectomia'
UNION ALL
SELECT st.id, 15, 30, '14º ao 30º PO', 'Reta final da recuperação inicial.',
  '["Dor leve, sem necessidade de uso de analgésicos de horário", "Diurese clara, sem sinais de sangramentos", "Sangramento vaginal ausente", "Deambula sem auxílio", "Presença de fome", "Flatos e evacuações presentes", "Ferida operatória limpa e seca"]'::jsonb,
  'Continue acompanhando sua recuperação e anote dúvidas para o retorno.', 4
FROM surgery_types st WHERE st.name = 'Histerectomia'
UNION ALL
SELECT st.id, 31, NULL, 'Após 30º PO', 'Avaliação final e retorno às atividades.',
  '["Avaliação de ferida operatória", "Sutura de cúpula vaginal", "Avaliação de conteúdo vaginal", "Retorno às atividades físicas de forma gradual", "Retorno à vida sexual", "Retorno às atividades laborais de forma gradual"]'::jsonb,
  'Converse com seu médico sobre o retorno às atividades.', 5
FROM surgery_types st WHERE st.name = 'Histerectomia';
