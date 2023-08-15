import { createEmbed } from '../discord/embed';

describe('createEmbed', () => {
  // Tests that the function returns an object with an 'embeds' property
  it('should return an object with an embeds property', () => {
    const result = createEmbed('title', 'description');
    expect(result).toHaveProperty('embeds');
  });

  // Tests that the function returns an object with an array containing an object with 'title' and 'description' properties
  it('should return an object with an array containing an object with title and description properties', () => {
    const result = createEmbed('title', 'description');
    expect(result.embeds).toBeInstanceOf(Array);
    expect(result.embeds[0]).toHaveProperty('title');
    expect(result.embeds[0]).toHaveProperty('description');
  });

  // Tests that the function sets the 'title' property to the passed 'title' argument
  it('should set the title property to the passed title argument', () => {
    const result = createEmbed('title', 'description');
    expect(result.embeds[0].title).toEqual('title');
  });

  // Tests that the function sets the 'description' property to the passed 'description' argument
  it('should set the description property to the passed description argument', () => {
    const result = createEmbed('title', 'description');
    expect(result.embeds[0].description).toEqual('description');
  });

  // Tests that the function handles an empty 'title' argument
  it('should handle an empty title argument', () => {
    const result = createEmbed('', 'description');
    expect(result.embeds[0].title).toEqual('');
  });

  // Tests that the function handles an empty 'description' argument
  it('should handle an empty description argument', () => {
    const result = createEmbed('title', '');
    expect(result.embeds[0].description).toEqual('');
  });
});
