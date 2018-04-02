module.exports = {
  MESSAGE_SENT:
      {
        code: 'MESSAGE_SENT',
        status: 200,
        title: 'Message posted',
        detail: 'Message was posted successfully.',
      },
  FORBIDDEN:
      {
        code: 'FORBIDDEN',
        status: 403,
        title: 'Forbidden Action',
        detail: 'The request did not come from Slack. Nice try.',
      },
  SERVER_ERROR:
      {
        code: 'SERVER_ERROR',
        status: 500,
        title: 'An error has occurred',
        detail: 'An error has occurred on the server.',
      },
};
