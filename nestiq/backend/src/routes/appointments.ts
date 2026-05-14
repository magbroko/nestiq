import { Router, Request, Response } from 'express';
import * as leadService from '../services/leadService.js';
import * as calendarService from '../services/calendarService.js';

const router = Router();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const appointments = await leadService.getAllAppointments();
    res.json({ appointments });
  } catch (err) {
    const error = err as Error;
    console.error('[Appointments] GET error:', error.message);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

router.patch('/:id/cancel', async (req: Request, res: Response): Promise<void> => {
  try {
    const client = (await import('../services/leadService.js'));
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      res.status(500).json({ error: 'Database not configured' });
      return;
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !appointment) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }

    if (appointment.calendar_event_id) {
      try {
        await calendarService.cancelInspectionEvent(appointment.calendar_event_id);
      } catch (err) {
        console.error('[Calendar] Failed to cancel event:', err);
      }
    }

    await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', req.params.id);

    await client.updateLead(appointment.lead_id, { status: 'qualified' });

    res.json({ success: true });
  } catch (err) {
    const error = err as Error;
    console.error('[Appointments] PATCH cancel error:', error.message);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

export default router;
