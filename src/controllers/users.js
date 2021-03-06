import JWT from '../utils/jwt.js';
import sha256 from 'sha256';

const REGISTER = async (req, res) => {
    const user = await req.models.User.create({
        username: req.body.username,
        password: sha256(req.body.password),
        email: req.body.email,
        credit_card: req.body.credit_card,
        address: req.body.address
    });
    const token = JWT.sign({ userId: user.user_id, agent: req.headers['user-agent'] });
    res.send({
        status: 201,
        message: 'User created successfully',
        data: user,
        token
    });
}

const GET = async (req, res) => {
    const users = await req.models.User.findAll({
        attributes: {
            exclude: ['password']
        }
    });
    res.send({
        status: 200,
        message: 'Users fetched successfully',
        data: users
    });
};

const LIKEDBOOKS = async (req, res) => {
    const user = await req.models.User.findOne({
        where: {
            user_id: req.userId
        }
    });

    const books = await req.models.Book.findAll({
        where: {
            book_id: {
                [Op.in]: user.liked_books
            }
        }
    });

    res.send({
        status: 200,
        message: 'Books fetched successfully',
        data: books
    });
    
};

const LOGIN = async (req, res) => {
    const user = await req.models.User.findOne({
        where: {
            username: req.body.username,
            password: sha256(req.body.password)
        }
    })

    if (user) {
        const token = JWT.sign({ userId: user.user_id, agent: req.headers['user-agent'] });
        res.send({
            status: 200,
            message: 'User logged in successfully',
            data: user,
            token
        });
    } else {
        res.send({
            status: 401,
            message: 'Invalid username or password',
            data: null
        });
    }
}

const MYBOOKS = async (req, res) => {
    const user = await req.models.User.findOne({
        where: {
            user_id: req.userId
        }
    });

    if (user) {
        const books = await req.models.Book.findAll({
            where: {
                user_id: user.user_id
            }
        });

        res.send({
            status: 200,
            message: 'Books fetched successfully',
            data: books
        });
    } else {
        res.send({
            status: 401,
            message: 'Invalid username or password',
            data: null
        });
    }
};

const STOREDBOOKS = async (req, res) => {
    const user = await req.models.User.findOne({
        where: {
            user_id: req.userId
        }
    });

    if (user) {
        const books = await req.models.Store.findAll({
            where: {
                user_id: user.user_id
            }
        });

        res.send({
            status: 200,
            message: 'Books fetched successfully',
            data: books
        });
    } else {
        res.send({
            status: 401,
            message: 'No books found',
            data: null
        });
    }
};

const ADDSTORE = async (req, res) => {
    const user = await req.models.User.findOne({
        where: {
            user_id: req.userId
        }
    });

    if (user) {
        const book = await req.models.Store.create({
            user_id: user.user_id,
            book_id: req.body.book_id
        });

        res.send({
            status: 200,
            message: 'Book added successfully',
            data: book
        });
    } else {
        res.send({
            status: 401,
            message: 'No books found',
            data: null
        });
    }
}


export default {
    REGISTER,
    GET,
    LOGIN,
    MYBOOKS,
    LIKEDBOOKS,
    STOREDBOOKS,
    ADDSTORE
}