import React, { useContext, useState, useEffect } from 'react'
import appContext from '../../store/Context'
import { withRouter } from 'react-router-dom'
import slugify from 'slugify'
import styled from 'styled-components'
import Image from '../../components/Image'
import Label from '../../components/Label'
import debug from '../../utils/debug'
import Select from 'react-select'

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
    grid-template-columns: 30rem 1fr 30rem;
    grid-gap: 2rem;

    > div  > div {
        margin-bottom: 2rem;
    }

    input, textarea, select, button {
        width: 100%;
    }
`

const SubImagesContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: var(--offset);
`

const Product = ({ history, match }) => {
    const store = useContext(appContext)
    const modeCreate = match.params.id === 'create'
    const [product, setProduct] = useState({
        id: '',
        name: '',
        price: '',
        description: '',
        identifier: '',
        image1: null,
        image2: null,
        image3: null
    })
    const [categories, setCategories] = useState([])
    const [categoriesForSelect, setCategoriesForSelect] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])

    useEffect(() => {
        (async () => {
            const Product = store.api.Object.extend('Product')
            try {
                if (!modeCreate) {
                    const proudctQuery = new store.api.Query(Product).get(match.params.id)
                    const product = await proudctQuery
                    setProduct({
                        id: product.id,
                        name: product.get('name'),
                        price: product.get('price'),
                        description: product.get('description'),
                        identifier: product.get('identifier'),
                        image1: product.get('image1'),
                        image2: product.get('image2'),
                        image3: product.get('image3')
                    })
                }
                const Category = store.api.Object.extend('Category')
                new store.api.Query(Category).descending('createdAt').find().then(fetchedCategories => {
                    setCategories(fetchedCategories)
                    setCategoriesForSelect(fetchedCategories.map(category => {
                        return { value: category.id, label: category.get('name') }
                    }))
                    if (!modeCreate) {
                        const _selectedCategories = []
                        fetchedCategories.map(category => {
                            category.relation('products').query().get(match.params.id).then(relationProduct => {
                                if (relationProduct.id) {
                                    _selectedCategories.push({ value: category.id, label: category.get('name') })
                                    setSelectedCategories([..._selectedCategories])
                                }
                            }, err => {})
                        })
                    }
                }).catch(err => {
                    debug(err)
                })
            } catch (err) {
                debug(err)
            }
        })()
    }, [match.params.id, store.api])

    const required = [{
        name: 'name',
        message: 'Введите название'
    }, {
        name: 'price',
        message: 'Введите цену'
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
            store.actions.pushToast(err.message, 'danger')
            debug(err)
            return false
        }
    }

    const hasImage = (image) => {
        return image && image.name !== '' && image.size > 0
    }

    const saveImage = async (image) => {
        try {
            return await new store.api.File(
                slugify(image.name, { remove: /[^a-zA-Z0-9_-]/g }),
                image
            ).save()
        } catch (err) {
            store.actions.pushToast('Не удалось загрузить изображение', 'danger')
            debug(err)
        }
    }

    const saveProduct = async (e) => {
        e.preventDefault()
        try {
            const data = new FormData(e.target)
            if (isRequired(data, required)) {
                const Product = store.api.Object.extend('Product')
                const product = (match.params.id && !modeCreate) ? await new store.api.Query(Product).get(match.params.id) : new Product()
                
                product.set('name', data.get('name'))
                product.set('price', +data.get('price'))
                product.set('description', data.get('description'))
                product.set('identifier', data.get('identifier'))

                for (const image of ['image1', 'image2', 'image3']) {
                    if (hasImage(data.get(image))) {
                        const Image = await saveImage(data.get(image))
                        product.set(image, Image)
                    }
                }

                product.save().then(saved => {
                    for (const category of categories) {
                        const relation = category.relation('products')
                        if (selectedCategories.find(selectedCategory => typeof selectedCategory !== 'undefined' && selectedCategory.value === category.id)) {
                            relation.add(saved)
                        } else {
                            relation.remove(saved)
                        }
                        category.save()
                    }

                    store.actions.pushToast('Товар сохранен', 'success')
                    history.replace(`/product/${saved.id}`)
                })
            }
        } catch (err) {
            store.actions.pushToast('Не удалось сохранить', 'danger')
            debug(err)
        }
    }

    const goBack = (e) => {
        e.preventDefault()
        history.goBack()
    }

    const changeImage = (e) => {
        if (e.target.name === 'image1') {
            setProduct({
                ...product,
                image1: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : product.image1 || ''
            })
        } else if (e.target.name === 'image2') {
            setProduct({
                ...product,
                image2: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : product.image2 || ''
            })
        } else if (e.target.name === 'image3') {
            setProduct({
                ...product,
                image3: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : product.image3 || ''
            })
        }
    }

    const changeMultipleCategory = selected => {
        setSelectedCategories(selected ? [...selected] : [])
    }

    const deleteProduct = e => {
        e.preventDefault()
        const Product = store.api.Object.extend('Product')
        new store.api.Query(Product).get(match.params.id).then(fetched => {
            fetched.destroy().then(() => {
                store.actions.pushToast(`${product.name} удален`, 'success')
                history.goBack()
            }, err => {
                store.actions.pushToast(`Не удалось удалить ${product.name}`, 'danger')
                debug(err)
            })
        })
    }

    return (
        <form onSubmit={saveProduct}>
            <Header>
                <h1 style={{margin: 0}}>{modeCreate ? 'Создать товар' : 'Просмотр товара'}</h1>
                <Controls>
                    <button onClick={goBack} style={{marginRight: '2rem'}}>Вернуться</button>
                    { !modeCreate ? <button onClick={deleteProduct} style={{marginRight: '2rem'}}>Удалить</button> : '' }
                    <button>Сохранить</button>
                </Controls>
            </Header>
            <Container>
                <div>
                    <div>
                        <Label>
                            {(product.image1 && (product.image1.url && product.image1.url()))
                                ? <Image src={product.image1.url()} alt="" />
                                : (product.image1
                                    ? <Image src={product.image1} alt="" />
                                    : <Image src="/images/placeholder.jpg" alt="" />)}
                            <input name="image1" type="file" accept="image/x-png, image/jpeg"
                                className="d-none" onChange={changeImage} />
                        </Label>
                    </div>
                    <SubImagesContainer>
                        {product.image1 || product.image2 ? (
                            <Label>
                                {(product.image2 && (product.image2.url && product.image2.url()))
                                    ? <Image src={product.image2.url()} alt="" />
                                    : (product.image2
                                        ? <Image src={product.image2} alt="" />
                                        : <Image src="/images/placeholder.jpg" alt="" />)}
                                <input name="image2" type="file" accept="image/x-png, image/jpeg"
                                    className="d-none" onChange={changeImage} />
                            </Label>
                        ) : ''}
                        {product.image2 || product.image3 ? (
                            <Label>
                                {(product.image3 && (product.image3.url && product.image3.url()))
                                    ? <Image src={product.image3.url()} alt="" />
                                    : (product.image3
                                        ? <Image src={product.image2} alt="" />
                                        : <Image src="/images/placeholder.jpg" alt="" />)}
                                <input name="image3" type="file" accept="image/x-png, image/jpeg"
                                    className="d-none" onChange={changeImage} />
                            </Label>
                        ) : ''}
                    </SubImagesContainer>
                </div>
                <div>
                    <div>
                        <input name="name" type="text" defaultValue={product.name} placeholder="Название" />
                    </div>
                    <div>
                        <input name="identifier" type="text" defaultValue={product.identifier} placeholder="ID" />
                    </div>
                    <div>
                        <textarea name="description" defaultValue={product.description} placeholder="Описание" rows="5" />
                    </div>
                </div>
                <div>
                    <div>
                        <input name="price" type="number" defaultValue={product.price} placeholder="Цена" />
                    </div>
                    <div>
                        <Select
                            value={selectedCategories}
                            onChange={changeMultipleCategory}
                            options={categoriesForSelect}
                            isMulti
                            isSearchable
                            isClearable={false}
                            closeMenuOnSelect={false}
                            placeholder="Автоматы"
                        />
                    </div>
                </div>
            </Container>
        </form>
    )
}

export default withRouter(Product)
