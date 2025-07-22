-- Create FAQ table with categories
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Battery', 'Charging', 'Maintenance', 'Troubleshooting')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (customers should see all FAQs)
CREATE POLICY "FAQs are publicly readable" 
ON public.faqs 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert predefined FAQ data
INSERT INTO public.faqs (question, answer, category) VALUES
-- Battery Questions
('How long does the battery last on a single charge?', 'The battery typically lasts 25-40 km depending on your weight, terrain, and riding conditions. Eco mode can extend the range significantly.', 'Battery'),
('How do I check my battery level?', 'The battery level is displayed on your scooter''s LED display. You can also check it through the mobile app if your model supports it.', 'Battery'),
('Why is my battery draining faster than usual?', 'Battery drain can increase due to cold weather, aggressive acceleration, uphill riding, or an aging battery. Try using eco mode and avoid full throttle starts.', 'Battery'),
('How often should I charge my battery?', 'Charge your battery after every ride or when it drops below 20%. Avoid letting it completely drain as this can damage the battery cells.', 'Battery'),

-- Charging Questions
('How long does it take to fully charge the battery?', 'A full charge typically takes 4-6 hours using the standard charger. Fast chargers can reduce this to 2-3 hours.', 'Charging'),
('Can I leave my scooter plugged in overnight?', 'Yes, modern chargers have overcharge protection. However, it''s best practice to unplug once fully charged to maximize battery lifespan.', 'Charging'),
('My charger is not working, what should I do?', 'First check if the power outlet works. Ensure all connections are secure. If the charger LED doesn''t turn on, contact support for a replacement.', 'Charging'),
('Can I use a different charger for my scooter?', 'Only use the original charger or manufacturer-approved alternatives. Wrong voltage can damage your battery permanently.', 'Charging'),

-- Maintenance Questions
('How often should I service my scooter?', 'Basic maintenance every 3 months or 500km. Professional service every 6 months or 1000km, whichever comes first.', 'Maintenance'),
('How do I clean my electric scooter?', 'Use a damp cloth to wipe down surfaces. Avoid direct water spray on electrical components. Clean the deck and handlebars regularly.', 'Maintenance'),
('When should I replace the tires?', 'Replace tires when tread depth is less than 2mm, or if you notice cracks, bulges, or frequent punctures. Typically every 1000-2000km.', 'Maintenance'),
('How do I store my scooter for winter?', 'Store in a dry place, charge battery to 50-70%, and charge monthly. Keep away from extreme temperatures.', 'Maintenance'),

-- Troubleshooting Questions
('My scooter won''t turn on, what should I check?', 'Check if battery is charged, ensure power button is held for 3-5 seconds, and verify all connections are secure. Try charging for 30 minutes first.', 'Troubleshooting'),
('Why is my scooter making unusual noises?', 'Grinding sounds may indicate brake issues. Clicking could be loose bolts. Rattling might be loose accessories. Stop riding and inspect immediately.', 'Troubleshooting'),
('My scooter is slower than usual, why?', 'Check tire pressure, battery level, and weight load. Cold weather can also reduce performance. Ensure you''re not in eco mode if you want full speed.', 'Troubleshooting');