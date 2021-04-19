class ResponseException extends Error {
  constructor(message: string) {
    super(message);
    
  }

  toString() {
    return this.message.toString();
  }
}

module.exports = { ResponseException };
