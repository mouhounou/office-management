
ALTER TABLE public.quote_requests
  ADD CONSTRAINT quote_requests_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 255),
  ADD CONSTRAINT quote_requests_name_len CHECK (length(name) BETWEEN 2 AND 100),
  ADD CONSTRAINT quote_requests_phone_len CHECK (length(phone) BETWEEN 6 AND 30),
  ADD CONSTRAINT quote_requests_message_len CHECK (length(message) BETWEEN 10 AND 2000),
  ADD CONSTRAINT quote_requests_company_len CHECK (company IS NULL OR length(company) <= 120),
  ADD CONSTRAINT quote_requests_budget_len CHECK (budget IS NULL OR length(budget) <= 50),
  ADD CONSTRAINT quote_requests_deadline_len CHECK (deadline IS NULL OR length(deadline) <= 50),
  ADD CONSTRAINT quote_requests_pole_valid CHECK (pole IN (
    'Formation professionnelle',
    'Mise à disposition de personnel',
    'Prestations techniques',
    'Conseil RH',
    'Services additionnels',
    'Excel & SAGE 100 i7'
  ));
