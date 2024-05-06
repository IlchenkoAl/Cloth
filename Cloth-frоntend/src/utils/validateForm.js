export default ({ values, errors }) => {
    const rules = {
        name: (errors, values) => {
            if (values.name === '') {
                errors.name = 'Пожалуйста заполните это поле'
            }
        },
        surname: (errors, values) => {
            if (values.surname === '') {
                errors.surname = 'Пожалуйста заполните это поле'
            }
        },
        // login: async (errors, values) => {
        //     if (values.login === '') {
        //         errors.login = 'Пожалуйста заполните это поле'
        //     }
        // },
        password: (errors, values) => {
            if (values.password === '') {
                errors.password = 'Пожалуйста заполните это поле'
            } else if (!/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}/i.test(values.password)) {
                errors.password = 'Слишком легкий пароль'
            }
        },
        confirmation: (errors, values) => {
            if (values.confirmation === '') {
                errors.confirmation = 'Пожалуйста заполните это поле'
            } else if (values.password !== values.confirmation) {
                errors.confirmation = 'Пароли не совпадают'
                errors.password = 'Пароли не совпадают'
            }
        }
    }

    Object.keys(values).forEach(
        key => rules[key] && rules[key](errors, values)
    )

    return errors
}