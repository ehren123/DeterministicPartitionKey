const { deterministicPartitionKey } = require('./dpk');

describe('deterministicPartitionKey', () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it('Returns "0" if event is null', () => {
    expect(deterministicPartitionKey(null)).toEqual('0');
  });

  it('Returns "0" if event is undefined', () => {
    expect(deterministicPartitionKey(undefined)).toEqual('0');
  });

  it('Returns "0" if event is empty', () => {
    expect(deterministicPartitionKey('')).toEqual('0');
  });

  it('Returns the partition key if it exists', () => {
    const event = { partitionKey: 'my-key' };
    expect(deterministicPartitionKey(event)).toEqual('my-key');
  });

  it('Hashes the event if partition key does not exist', () => {
    const event = { name: 'John', age: 25 };
    const expected = '8d38d6a83b23ed84a5dce348e5010931e5e766112f1be08c19083484df93477554c842dde2e2333ac977dd9fa0d51e8bc97dada80abb542a4499cc76ab986973';
    expect(deterministicPartitionKey(event)).toEqual(expected);
  });

  it('Handles non-string partition keys', () => {
    const event = { partitionKey: 123 };
    const expected = '123';
    expect(deterministicPartitionKey(event)).toEqual(expected);
  });

  it('Hashes a partition key above 256 characters', () => {
    const event = { partitionKey: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean gravida lobortis tortor, quis placerat mi elementum vel. Duis condimentum finibus metus ac venenatis. Praesent tincidunt felis maximus pulvinar ultrices. In suscipit quam non libero pretium rutrum. Vivamus tristique enim sed enim consectetur rutrum. Mauris vel urna fringilla, interdum leo ullamcorper, faucibus felis. Aenean dapibus dui quis mi ultrices volutpat. Etiam elit eros, tincidunt eget dignissim sit amet, sollicitudin a lacus. Mauris non pharetra elit. Mauris non nunc eu elit consequat pharetra quis a felis. Nulla sodales dignissim augue, vitae blandit nibh semper vel. Vivamus nisi risus, placerat a mi quis, feugiat aliquam dolor. Donec consectetur efficitur magna nec tempor. Donec imperdiet libero et risus malesuada, sit amet vehicula elit dictum. Nunc varius ante eu urna vulputate vehicula. Quisque ut molestie est, eget vehicula quam.' };
    const expected = '63f6a6312de2cb107f2bbc018d486a85c87c81ea8fbda024f74096eb0a62b9bfee73fe1f9a06231104c3b98119aaa6764dc75c3ce2397f797b240b55f0d06174';
    expect(deterministicPartitionKey(event)).toEqual(expected);
  });
});
