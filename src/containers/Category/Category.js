import React, { useContext, useState, useEffect } from 'react'
import appContext from '../../store/Context'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import debug from '../../utils/debug'
import Label from '../../components/Label'
import Image from '../../components/Image'
import slugify from 'slugify'

const Header = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 4rem;
`

const Controls = styled.div`
    display: flex;
`

const Container = styled.div`
    display: grid;
    grid-template-columns: 30rem 1fr;
    grid-gap: 2rem;

    > div  > div {
        margin-bottom: 2rem;
    }

    input, textarea, select, button {
        width: 100%;
    }
`

const Category = () => {
    const history = useHistory()
    const { id } = useParams()
    const modeCreate = id === 'create'
    const { api, actions } = useContext(appContext)
    const [category, setCategory] = useState({})
    const [imagePreview, setImagePreview] = useState({
        url: null,
        file: null
    })

    useEffect(() => {
        try {
            const Category = api.Object.extend('Category')
            if (modeCreate) {
                setCategory(new Category())
            } else {
                new api.Query(Category).get(id).then(fetched => {
                    setCategory(fetched)
                })
            }
        } catch (err) {
            debug(err)
        }
    }, [id, api, modeCreate])

    const required = [{
        name: 'name',
        message: 'Введите название'
    }, {
        name: 'identifier',
        message: 'Введите идентификатор'
    }]
    
    const isRequired = (data, required) => {
        try {
            for (const {name, message} of required) {
                const field = data.get(name)
                if (field === '') {
                    throw new Error(message)
                }
            }
            return true
        } catch (err) {
            actions.pushToast(err.message, 'danger')
            debug(err)
            return false
        }
    }

    const remove = e => {
        e.preventDefault()
        try {
            category.destroy().then(() => {
                actions.pushToast(`Автомат ${category.get('name')} удален`, 'success')
                history.goBack()
            })
        } catch (err) {
            actions.pushToast(`Не удалось удалить автомат ${category.get('name')}`, 'danger')
            debug(err)
        }
        
    }

    const save = async e => {
        e.preventDefault()
        try {
            const data = new FormData(e.target)
            
            if (isRequired(data, required)) {
                category.set('name', data.get('name'))
                category.set('description', data.get('description'))
                category.set('identifier', data.get('identifier'))
                if (imagePreview.file) {
                    category.set('image', await new api.File(
                        slugify(imagePreview.file.name, { remove: /[^a-zA-Z0-9_-]/g }),
                        imagePreview.file
                    ).save())
                }

                category.save().then(saved => {
                    actions.pushToast('Автомат успешно сохранен', 'success')
                    history.replace(`/category/${saved.id}`)
                })
            }
        } catch (err) {
            actions.pushToast('Не удалось сохранить автомат', 'danger')
            debug(err)
        }

    }

    const back = e => {
        e.preventDefault()
        history.goBack()
    }

    const changeImage = e => {
        setImagePreview({
            url: URL.createObjectURL(e.target.files[0]),
            file: e.target.files[0]
        })
    }

    return (
        <form onSubmit={save}>
            <Header>
                <h1 style={{margin: 0}}>{modeCreate ? 'Добавить автомат' : 'Просмотр автомата'}</h1>
                <Controls>
                    {!modeCreate
                        ? <button onClick={remove} style={{marginRight: '2rem'}}>Удалить</button>
                        : ''}
                    <button onClick={back} style={{marginRight: '2rem'}}>Вернуться</button>
                    <button>Сохранить</button>
                </Controls>
            </Header>
            <Container>
                <div>
                    <div>
                        <Label>
                            {imagePreview.url ? <Image src={imagePreview.url} alt="" /> : category.id && category.get('image')
                                ? <Image src={category.get('image').url()} alt="" />
                                : <Image src="/images/placeholder.jpg" alt="" />}
                            <input name="image" type="file" accept="image/x-png, image/jpeg"
                                className="d-none" onChange={changeImage} />
                        </Label>
                    </div>
                </div>
                <div>
                    <div>
                        <input name="name" type="text" defaultValue={category.id ? category.get('name') : ''} placeholder="Название" />
                    </div>
                    <div>
                        <input name="identifier" type="text" defaultValue={category.id ? category.get('identifier') : ''} placeholder="ID" />
                    </div>
                    <div>
                        <textarea name="description" defaultValue={category.id ? category.get('description') : ''} placeholder="Описание" rows="5" />
                    </div>
                </div>
            </Container>
        </form>
    )
}

export default Category
