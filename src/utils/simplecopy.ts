/**
 * A simple utility function to copy text to clipboard
 * @param text The text to copy to clipboard
 * @returns boolean indicating success or failure
 */
export const simplecopy = (text: string): boolean => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-999999px';
  textarea.style.top = '-999999px';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand('copy');
    return true;
  } catch (err) {
    return false;
  } finally {
    textarea.remove();
  }
}; 