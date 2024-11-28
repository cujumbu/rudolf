-- Add this after the existing SQL
INSERT INTO public.stations (
  id,
  name,
  location,
  device_id,
  is_active
) VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Main Station',
  'Main Office',
  'MAIN-001',
  true
) ON CONFLICT (device_id) DO NOTHING;