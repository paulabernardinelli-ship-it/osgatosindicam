const { app } = require('@azure/functions');

// Health check endpoint
app.http('health', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Health check function called');
        
        return {
            status: 200,
            jsonBody: {
                success: true,
                message: 'API está funcionando!',
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'production'
            },
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };
    }
});

// Users register endpoint
app.http('register', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const body = await request.json();
            const { name, email, password } = body;

            context.log(`Register attempt for: ${email}`);

            // Validação simples
            if (!name || !email || !password) {
                return {
                    status: 400,
                    jsonBody: {
                        success: false,
                        message: 'Nome, email e senha são obrigatórios'
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                };
            }

            // Simulação de usuário criado
            const user = {
                id: Math.floor(Math.random() * 1000) + 1,
                name: name,
                email: email,
                created_at: new Date().toISOString()
            };

            return {
                status: 201,
                jsonBody: {
                    success: true,
                    message: 'Usuário criado com sucesso!',
                    data: {
                        user: user,
                        token: 'jwt-simulado-' + Date.now()
                    }
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            };

        } catch (error) {
            context.log('Error in register:', error);
            return {
                status: 500,
                jsonBody: {
                    success: false,
                    message: 'Erro interno do servidor'
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            };
        }
    }
});

// Users login endpoint
app.http('login', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const body = await request.json();
            const { email, password } = body;

            context.log(`Login attempt for: ${email}`);

            if (!email || !password) {
                return {
                    status: 400,
                    jsonBody: {
                        success: false,
                        message: 'Email e senha são obrigatórios'
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                };
            }

            // Simulação de login bem-sucedido
            const user = {
                id: 1,
                name: 'Usuário de Teste',
                email: email,
                created_at: new Date().toISOString()
            };

            return {
                status: 200,
                jsonBody: {
                    success: true,
                    message: 'Login realizado com sucesso!',
                    data: {
                        user: user,
                        token: 'jwt-autenticado-' + Date.now()
                    }
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            };

        } catch (error) {
            context.log('Error in login:', error);
            return {
                status: 500,
                jsonBody: {
                    success: false,
                    message: 'Erro interno do servidor'
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            };
        }
    }
});

// CORS preflight handler
app.http('options', {
    methods: ['OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        return {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
                'Access-Control-Max-Age': '86400'
            }
        };
    }
});

module.exports = app;