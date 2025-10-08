import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'testimonials',
    title:'Testimonials',
    type:'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string'
        }),
        defineField({
      name: 'body',
      title: 'Message',
      type: 'blockContent',
    }),
        
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot:true,
            },
        })
        
    ]
})