// This service is used to test if the application can make external API calls
// It's useful for diagnosing connection issues

/**
 * Tests if the application can make external API calls by fetching a simple JSON endpoint
 * @returns A promise that resolves to a boolean indicating if the connection was successful
 */
export const testExternalConnection = async (): Promise<boolean> => {
  try {
    // Try to fetch a simple JSON endpoint (JSONPlaceholder is a free fake API for testing)
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      // Set a timeout to avoid waiting too long
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      console.log('External API connection test successful');
      return true;
    } else {
      console.warn('External API connection test failed with status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('External API connection test error:', error);
    return false;
  }
};

/**
 * Tests if the application can connect to Supabase
 * @param supabaseUrl The Supabase URL to test
 * @param apiKey The Supabase API key to use for authentication
 * @returns A promise that resolves to an object with the test results
 */
export const testSupabaseConnection = async (
  supabaseUrl: string,
  apiKey: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Try to fetch the Supabase REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      },
      // Set a timeout to avoid waiting too long
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Supabase connection successful'
      };
    } else {
      return {
        success: false,
        message: `Supabase connection failed with status: ${response.status}`
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Supabase connection error: ${error.message || 'Unknown error'}`
    };
  }
};

/**
 * Runs a comprehensive connection test and returns detailed results
 */
export const runConnectionDiagnostics = async (
  supabaseUrl: string,
  apiKey: string
): Promise<{
  externalApiWorking: boolean;
  supabaseApiWorking: boolean;
  supabaseAuthWorking: boolean;
  details: string[];
}> => {
  const details: string[] = [];

  // Test external API connection
  const externalApiWorking = await testExternalConnection();
  details.push(`External API connection: ${externalApiWorking ? 'SUCCESS' : 'FAILED'}`);

  // Test Supabase REST API
  const restApiTest = await testSupabaseConnection(supabaseUrl, apiKey);
  const supabaseApiWorking = restApiTest.success;
  details.push(`Supabase REST API: ${restApiTest.message}`);

  // Test Supabase Auth API
  let supabaseAuthWorking = false;
  try {
    // Try to access the settings endpoint which should be available without authentication
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      method: 'GET',
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(5000)
    });

    supabaseAuthWorking = authResponse.ok;

    if (authResponse.ok) {
      details.push(`Supabase Auth API: SUCCESS`);
    } else {
      // Try to get more detailed error information
      try {
        const errorText = await authResponse.text();
        details.push(`Supabase Auth API: FAILED with status ${authResponse.status} - ${errorText}`);

        // Try an alternative endpoint as fallback
        console.log('Trying alternative Auth API endpoint...');
        const fallbackResponse = await fetch(`${supabaseUrl}/auth/v1/`, {
          method: 'GET',
          headers: {
            'apikey': apiKey,
            'Accept': 'application/json'
          },
          signal: AbortSignal.timeout(5000)
        });

        if (fallbackResponse.ok || fallbackResponse.status === 404) {
          // Even a 404 means the Auth API is reachable
          supabaseAuthWorking = true;
          details.push(`Supabase Auth API: SUCCESS (fallback endpoint)`);
        }
      } catch (fallbackError) {
        details.push(`Supabase Auth API: FAILED with status ${authResponse.status}`);
      }
    }
  } catch (error: any) {
    console.error('Auth API test error:', error);
    details.push(`Supabase Auth API: FAILED with error ${error.message || 'Unknown error'}`);
  }

  return {
    externalApiWorking,
    supabaseApiWorking,
    supabaseAuthWorking,
    details
  };
};
