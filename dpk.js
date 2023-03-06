const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

exports.deterministicPartitionKey = (event) => {
  // If the event object is falsy, use the trivial partition key.
  if(!event) {
    return TRIVIAL_PARTITION_KEY;
  }

  let candidate;

  // If the event object is defined and has a partition key, use it as the candidate
  if (event.partitionKey) {
    candidate = event.partitionKey;
  } else {
    // Otherwise, hash the event object using SHA3-512 and use the digest as the candidate
    const data = JSON.stringify(event);
    candidate = crypto.createHash("sha3-512").update(data).digest("hex");
  }

  // Convert the candidate to a string if it isn't already one
  if (typeof candidate !== "string") {
    candidate = JSON.stringify(candidate);
  }

  // If the candidate is too long, hash it again using SHA3-512
  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }

  return candidate
};