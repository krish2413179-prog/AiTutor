/**
 * Extract topics from user messages
 */
export function extractTopics(messages) {
  const topics = new Set();
  
  // Common learning topics and keywords
  const topicKeywords = {
    // Programming Languages
    'JavaScript': ['javascript', 'js', 'node', 'react', 'vue', 'angular'],
    'Python': ['python', 'django', 'flask', 'pandas', 'numpy'],
    'Rust': ['rust', 'cargo', 'rustc'],
    'TypeScript': ['typescript', 'ts'],
    'Java': ['java', 'spring', 'maven'],
    'C++': ['c++', 'cpp'],
    'Go': ['golang', 'go'],
    'Solidity': ['solidity', 'smart contract'],
    
    // Web Development
    'HTML': ['html', 'html5'],
    'CSS': ['css', 'css3', 'tailwind', 'bootstrap'],
    'React': ['react', 'jsx', 'hooks'],
    'Node.js': ['node', 'nodejs', 'express'],
    'Web Development': ['web dev', 'frontend', 'backend', 'fullstack'],
    
    // Blockchain
    'Blockchain': ['blockchain', 'distributed ledger'],
    'Solana': ['solana', 'sol', 'spl'],
    'Ethereum': ['ethereum', 'eth', 'evm'],
    'Web3': ['web3', 'dapp', 'defi'],
    'NFT': ['nft', 'non-fungible'],
    'Cryptocurrency': ['crypto', 'cryptocurrency', 'bitcoin'],
    
    // Mathematics
    'Calculus': ['calculus', 'derivative', 'integral'],
    'Algebra': ['algebra', 'equation', 'polynomial'],
    'Statistics': ['statistics', 'probability', 'distribution'],
    'Linear Algebra': ['linear algebra', 'matrix', 'vector'],
    'Geometry': ['geometry', 'triangle', 'circle'],
    
    // Science
    'Physics': ['physics', 'mechanics', 'thermodynamics'],
    'Chemistry': ['chemistry', 'molecule', 'reaction'],
    'Biology': ['biology', 'cell', 'dna', 'organism'],
    
    // Computer Science
    'Algorithms': ['algorithm', 'sorting', 'searching', 'complexity'],
    'Data Structures': ['data structure', 'array', 'linked list', 'tree', 'graph'],
    'Machine Learning': ['machine learning', 'ml', 'neural network', 'ai'],
    'Database': ['database', 'sql', 'nosql', 'mongodb', 'postgresql'],
    'API': ['api', 'rest', 'graphql', 'endpoint'],
    
    // Languages
    'Spanish': ['spanish', 'español'],
    'French': ['french', 'français'],
    'German': ['german', 'deutsch'],
    'Chinese': ['chinese', 'mandarin'],
    'Japanese': ['japanese', 'nihongo'],
    
    // Business
    'Marketing': ['marketing', 'seo', 'advertising'],
    'Finance': ['finance', 'accounting', 'investment'],
    'Economics': ['economics', 'supply', 'demand', 'market'],
    'Management': ['management', 'leadership', 'strategy'],
    
    // Design
    'UI/UX': ['ui', 'ux', 'user interface', 'user experience'],
    'Graphic Design': ['graphic design', 'photoshop', 'illustrator'],
    '3D Modeling': ['3d', 'blender', 'modeling'],
    
    // Other
    'Git': ['git', 'github', 'version control'],
    'Docker': ['docker', 'container', 'kubernetes'],
    'Testing': ['testing', 'unit test', 'integration test'],
    'Security': ['security', 'encryption', 'authentication'],
  };
  
  // Extract user messages only
  const userMessages = messages
    .filter(msg => msg.role === 'user')
    .map(msg => msg.content.toLowerCase());
  
  // Check each message for topic keywords
  userMessages.forEach(message => {
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => message.includes(keyword))) {
        topics.add(topic);
      }
    });
  });
  
  return Array.from(topics);
}

/**
 * Update user topics in database
 */
export async function updateUserTopics(supabase, walletAddress, messages) {
  try {
    const detectedTopics = extractTopics(messages);
    
    if (detectedTopics.length === 0) return;
    
    // Get current topics
    const { data: profile } = await supabase
      .from('profiles')
      .select('topics_mastered')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (!profile) return;
    
    // Merge with existing topics
    const existingTopics = profile.topics_mastered || [];
    const allTopics = [...new Set([...existingTopics, ...detectedTopics])];
    
    // Update profile
    await supabase
      .from('profiles')
      .update({ topics_mastered: allTopics })
      .eq('wallet_address', walletAddress);
    
    return allTopics;
  } catch (error) {
    console.error('Error updating topics:', error);
    return [];
  }
}
