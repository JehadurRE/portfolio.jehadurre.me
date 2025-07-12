    // Decode base64 content properly
    const decodeBase64UTF8 = (base64String: string) => {
      try {
        const cleanBase64 = base64String.replace(/\s/g, '');
        const binaryString = atob(cleanBase64);
        const bytes = new Uint8Array(binaryString.length);
        
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(bytes);
      } catch (error) {
        console.error('Error decoding base64 UTF-8:', error);
        return atob(base64String.replace(/\s/g, ''));
      }
    };

    export default decodeBase64UTF8;