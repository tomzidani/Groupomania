// Importation
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Database = require('../database');
const database = new Database();

// Inscription de l'utilisateur
exports.signup = (req, res, next) => {

    // Déclaration de la variable user
    const user = req.body;

    // Si les données sont incomplètes on renvoit un code d'erreur 500
    if(!user.surname || !user.name || !user.email || !user.password) return res.status(500).json({ error: 'Bad request' });

    database.query('SELECT email FROM users WHERE email = ? LIMIT 1', [req.body.email])
        .then(data => {

            // Déclaration du résultat
            const result = data[0];

            // Si l'adresse e-mail est déjà utilisée on renvoit un code d'erreur
            if(result) return res.status(409).json({ error: 'Email already exists' });

            // Hash du mot de passe
            bcrypt.hash(req.body.password, 10)
                .then(hash => {

                    // Déclaration de la variable des données
                    const data = {
                        name: user.name,
                        surname: user.surname,
                        email: user.email,
                        password: hash,
                        gender: user.gender
                    }

                    // Insertion des informations dans la base de données
                    database.query('INSERT INTO users SET ?', data)
                        .then((packet) =>{

                            // Création du token et de l'userId
                            const userId = packet.insertId;
                            const token = jwt.sign(
                                {
                                    userId: userId,
                                    isAdmin: 0
                                },
                                'RANDOM_TOKEN_SECRET',
                                {
                                    expiresIn: '4h'
                                }
                            )
                            res.status(201).json({userId: userId, token: token});
                        })
                        .catch(err => res.status(400).json(err));
                })
                .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
};

// Connexion de l'utilisateur
exports.login = (req, res, next) => {

    // Déclaration de la variable user
    const user = req.body;

    // S'il manque une donnée, on renvoit un code 500
    if(!user.email || !user.password) return res.status(500).json({ error: 'Bad request' });

    database.query('SELECT id, email, password, admin FROM users WHERE email = ?', [user.email])
        .then(data => {

            // Déclaration de la variable de résultat
            const result = data[0];

            // Si l'on ne trouve pas l'utilisateur, on renvoit un code 404
            if(!result) return res.status(404).json({ error: 'User not find' });

            bcrypt.compare(user.password, result.password)
                .then(valid => {

                    // Si le mot de passe n'est pas valide on renvoit un code 401
                    if(!valid) return res.status(401).json({ error: 'Password incorrect' });

                    // Déclaration des variable userId et du token
                    const userId = result.id;
                    const isAdmin = result.admin;
                    const token = jwt.sign(
                        {
                            userId: userId,
                            isAdmin: result.admin
                        },
                        'RANDOM_TOKEN_SECRET',
                        {
                            expiresIn: '4h'
                        }
                    );
                    res.status(200).json({ userId: userId, token: token, isAdmin: isAdmin });
                })
                .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
};