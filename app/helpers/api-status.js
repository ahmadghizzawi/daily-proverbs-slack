module.exports = {
  MESSAGE_SENT:
      {
        code: 'MESSAGE_SENT',
        status: 200,
        title: 'Message posted',
        details: 'Message was posted successfully.',
      },
  FORBIDDEN:
      {
        code: 'FORBIDDEN',
        status: 403,
        title: 'Forbidden Action',
        details: 'The request did not come from Slack. Nice try.',
      },
  SERVER_ERROR:
      {
        code: 'SERVER_ERROR',
        status: 500,
        title: 'A server error has occurred',
        details: 'A server error has occurred.',
      },
};
