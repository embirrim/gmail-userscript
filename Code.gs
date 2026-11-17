function moveSentToInbox() {
  const props = PropertiesService.getUserProperties();
  const now = Math.floor(Date.now() / 1000);
  const lastRun = Number(props.getProperty('lastRun')) || now - 300;

  // Only emails sent since the last run (with a 60s overlap so nothing slips through)
  const query = `in:sent -in:inbox -label:calendar-notifications after:${lastRun - 60}`;

  GmailApp.search(query, 0, 100).forEach(thread => {
    const messages = thread.getMessages();
    if (messages.length === 1 && !isCalendarEmail(messages[0])) {
      thread.moveToInbox();
    }
  });

  props.setProperty('lastRun', String(now));
}

// RSVPs, invites and event updates all contain a text/calendar part
function isCalendarEmail(message) {
  return /text\/calendar/i.test(message.getRawContent());
}
