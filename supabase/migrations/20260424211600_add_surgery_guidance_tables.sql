-- ============================================================
-- Migration: add_surgery_guidance_tables
-- Creates tables for surgery-specific signs and phase guidelines
-- Seeds data for Colecistectomia and Histerectomia
-- ============================================================

-- 1. Create surgery_type_signs table
CREATE TABLE IF NOT EXISTS surgery_type_signs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  surgery_type_id uuid NOT NULL REFERENCES surgery_types(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('alert', 'attention', 'normal')),
  description text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Create surgery_type_phase_guidelines table
CREATE TABLE IF NOT EXISTS surgery_type_phase_guidelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  surgery_type_id uuid NOT NULL REFERENCES surgery_types(id) ON DELETE CASCADE,
  phase_start_day integer NOT NULL,
  phase_end_day integer,
  phase_title text NOT NULL,
  phase_subtitle text,
  items jsonb NOT NULL DEFAULT '[]',
  highlight_text text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_surgery_type_signs_type_id ON surgery_type_signs(surgery_type_id);
CREATE INDEX idx_surgery_type_phase_guidelines_type_id ON surgery_type_phase_guidelines(surgery_type_id);

-- ============================================================
-- 3. Seed data
-- ============================================================

DO $$
DECLARE
  v_colec_id uuid;
  v_hister_id uuid;
BEGIN
  SELECT id INTO v_colec_id FROM surgery_types WHERE name LIKE 'Colecistectomia%' LIMIT 1;
  SELECT id INTO v_hister_id FROM surgery_types WHERE name = 'Histerectomia' LIMIT 1;

  -- ========================================
  -- COLECISTECTOMIA - Signs
  -- ========================================
  IF v_colec_id IS NOT NULL THEN
    INSERT INTO surgery_type_signs (surgery_type_id, category, description, display_order) VALUES
      (v_colec_id, 'alert', 'Icterícia (pele ou olhos amarelados)', 1),
      (v_colec_id, 'alert', 'Fezes esbranquiçadas (acolia fecal)', 2),
      (v_colec_id, 'alert', 'Dor abdominal intensa que não melhora com analgésicos', 3),
      (v_colec_id, 'alert', 'Vômitos persistentes', 4),
      (v_colec_id, 'alert', 'Febre (acima de 37,8°C)', 5),
      (v_colec_id, 'alert', 'Sangramento intenso pela ferida operatória', 6),
      (v_colec_id, 'alert', 'Saída de conteúdo purulento da ferida operatória', 7),
      (v_colec_id, 'attention', 'Dor abdominal moderada', 1),
      (v_colec_id, 'attention', 'Hiperemia (vermelhidão) na ferida operatória', 2),
      (v_colec_id, 'attention', 'Saída de líquido claro e sem odor da ferida operatória', 3),
      (v_colec_id, 'normal', 'Dor leve nos ombros nos primeiros dias (gás da cirurgia)', 1),
      (v_colec_id, 'normal', 'Dor abdominal leve que melhora com analgésicos comuns', 2),
      (v_colec_id, 'normal', 'Náuseas leves nos primeiros dias', 3),
      (v_colec_id, 'normal', 'Sensação de dormência na ferida operatória', 4);

    -- COLECISTECTOMIA - Phase Guidelines
    INSERT INTO surgery_type_phase_guidelines (surgery_type_id, phase_start_day, phase_end_day, phase_title, phase_subtitle, items, highlight_text, display_order) VALUES
      (v_colec_id, 0, 3, 'Dias 0 a 3 – Adaptação Inicial',
       'Seu corpo está se ajustando à cirurgia.',
       '["Descanse, mas não fique o tempo todo deitado.", "Caminhe pequenas distâncias várias vezes ao dia.", "Dor nos ombros pode ocorrer (gás da cirurgia).", "Náuseas leves podem acontecer."]',
       'O mais importante agora é descanso ativo e observação.', 1),
      (v_colec_id, 4, 7, 'Dias 4 a 7 – Recuperação Progressiva',
       'A cada dia, você deve se sentir um pouco melhor.',
       '["A dor tende a diminuir.", "A alimentação fica mais fácil.", "A mobilidade melhora."]',
       'Se algo estiver piorando, não ignore — avise pelo aplicativo.', 2),
      (v_colec_id, 8, 14, 'Dias 8 a 14 – Consolidação da Recuperação',
       'Você está entrando na fase final da recuperação inicial.',
       '["Retorno gradual às atividades habituais.", "Menor necessidade de analgésicos.", "Feridas em processo de cicatrização."]',
       'Este período prepara você para o retorno presencial.', 3);
  END IF;

  -- ========================================
  -- HISTERECTOMIA - Signs
  -- ========================================
  IF v_hister_id IS NOT NULL THEN
    INSERT INTO surgery_type_signs (surgery_type_id, category, description, display_order) VALUES
      (v_hister_id, 'alert', 'Ausência de diurese', 1),
      (v_hister_id, 'alert', 'Urina vermelha', 2),
      (v_hister_id, 'alert', 'Sangramento vaginal intenso', 3),
      (v_hister_id, 'alert', 'Corrimento vaginal com odor', 4),
      (v_hister_id, 'alert', 'Dor abdominal intensa', 5),
      (v_hister_id, 'alert', 'Vômitos persistentes', 6),
      (v_hister_id, 'alert', 'Febre', 7),
      (v_hister_id, 'alert', 'Dor e edema em membro inferior, principalmente se assimétrico', 8),
      (v_hister_id, 'alert', 'Saída de conteúdo purulento de ferida operatória', 9),
      (v_hister_id, 'alert', 'Sangramento intenso por ferida operatória', 10),
      (v_hister_id, 'attention', 'Urina alaranjada', 1),
      (v_hister_id, 'attention', 'Dor abdominal moderada', 2),
      (v_hister_id, 'attention', 'Hiperemia em ferida operatória', 3),
      (v_hister_id, 'attention', 'Saída de líquido aspecto claro e sem odor de ferida operatória', 4),
      (v_hister_id, 'normal', 'Sangramento vaginal discreto nos primeiros dias', 1),
      (v_hister_id, 'normal', 'Dor abdominal leve a moderada que melhora com analgésicos comuns', 2),
      (v_hister_id, 'normal', 'Sensação de dormência em ferida operatória', 3);

    -- HISTERECTOMIA - Phase Guidelines
    INSERT INTO surgery_type_phase_guidelines (surgery_type_id, phase_start_day, phase_end_day, phase_title, phase_subtitle, items, highlight_text, display_order) VALUES
      (v_hister_id, 1, 1, '1º PO',
       'Primeiro dia após a cirurgia – período de observação.',
       '["Dor abdominal leve a moderada, com melhora com uso de analgésicos simples", "Diurese espontânea após retirada de SVD", "Sangramento vaginal discreto", "Deambula sem auxílio", "Presença de fome", "Flatos presentes"]',
       'O primeiro dia é fundamental para observação. Comunique qualquer alteração.', 1),
      (v_hister_id, 2, 5, '2º ao 5º PO',
       'Recuperação progressiva – você deve sentir melhora gradual.',
       '["Dor abdominal leve a moderada, em curva de melhora no decorrer dos dias", "Diurese clara, sem sinais de sangramentos", "Sangramento vaginal discreto ou ausente", "Deambula sem auxílio", "Presença de fome", "Flatos e evacuações presentes", "Ferida operatória limpa e seca"]',
       'Você deve sentir melhora gradual a cada dia.', 2),
      (v_hister_id, 6, 14, '5º ao 14º PO',
       'Fase de consolidação da recuperação.',
       '["Dor leve, sem necessidade de uso de analgésicos de horário", "Diurese clara, sem sinais de sangramentos", "Sangramento vaginal ausente", "Deambula sem auxílio", "Presença de fome", "Flatos e evacuações presentes", "Ferida operatória limpa e seca"]',
       'A dor deve estar bem controlada nesta fase.', 3),
      (v_hister_id, 15, 30, '14º ao 30º PO',
       'Reta final da recuperação inicial.',
       '["Dor leve, sem necessidade de uso de analgésicos de horário", "Diurese clara, sem sinais de sangramentos", "Sangramento vaginal ausente", "Deambula sem auxílio", "Presença de fome", "Flatos e evacuações presentes", "Ferida operatória limpa e seca"]',
       'Continue acompanhando sua recuperação e anote dúvidas para o retorno.', 4),
      (v_hister_id, 31, NULL, 'Após 30º PO',
       'Avaliação final e retorno às atividades.',
       '["Avaliação de ferida operatória", "Sutura de cúpula vaginal", "Avaliação de conteúdo vaginal", "Retorno às atividades físicas de forma gradual", "Retorno à vida sexual", "Retorno às atividades laborais de forma gradual"]',
       'Converse com seu médico sobre o retorno às atividades.', 5);
  END IF;
END $$;
