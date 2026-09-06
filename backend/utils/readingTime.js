const calculateReadingTime = (content) => {
  if (!content) return 1;
  const cleanText = content.replace(/<[^>]*>/g, '');
  const words = cleanText.trim().split(/\s+/).filter(word => word.length > 0).length;
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes || 1;
};

module.exports = calculateReadingTime;
