-- Seed categories for the personal finance app
-- Expense categories
INSERT INTO category (id, name) VALUES (1, 'Alimentacion') ON CONFLICT (id) DO NOTHING;
INSERT INTO category (id, name) VALUES (2, 'Transporte') ON CONFLICT (id) DO NOTHING;
INSERT INTO category (id, name) VALUES (3, 'Vivienda') ON CONFLICT (id) DO NOTHING;
INSERT INTO category (id, name) VALUES (4, 'Entretenimiento') ON CONFLICT (id) DO NOTHING;
INSERT INTO category (id, name) VALUES (5, 'Salud') ON CONFLICT (id) DO NOTHING;
INSERT INTO category (id, name) VALUES (6, 'Educacion') ON CONFLICT (id) DO NOTHING;
INSERT INTO category (id, name) VALUES (7, 'Compras') ON CONFLICT (id) DO NOTHING;
INSERT INTO category (id, name) VALUES (8, 'Otros') ON CONFLICT (id) DO NOTHING;

-- Income categories
INSERT INTO category (id, name) VALUES (9, 'Salario') ON CONFLICT (id) DO NOTHING;
INSERT INTO category (id, name) VALUES (10, 'Freelance') ON CONFLICT (id) DO NOTHING;
INSERT INTO category (id, name) VALUES (11, 'Inversion') ON CONFLICT (id) DO NOTHING;
INSERT INTO category (id, name) VALUES (12, 'Bono') ON CONFLICT (id) DO NOTHING;
INSERT INTO category (id, name) VALUES (13, 'Regalo') ON CONFLICT (id) DO NOTHING;
INSERT INTO category (id, name) VALUES (14, 'Ahorro') ON CONFLICT (id) DO NOTHING;
INSERT INTO category (id, name) VALUES (15, 'Reembolso') ON CONFLICT (id) DO NOTHING;
INSERT INTO category (id, name) VALUES (16, 'Otro') ON CONFLICT (id) DO NOTHING;
