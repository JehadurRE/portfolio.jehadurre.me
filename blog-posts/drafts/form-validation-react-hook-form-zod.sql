INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  cover_image,
  category,
  tags,
  published_at,
  read_time,
  is_published,
  seo_title,
  seo_description
) VALUES (
  'Form Validation in React: Why I Switched to React Hook Form and Zod',
  'form-validation-react-hook-form-zod',
  'Discover why combining React Hook Form with Zod schema validation is the ultimate solution for building robust, performant forms in modern React applications.',
  '# Form Validation in React: Why I Switched to React Hook Form and Zod

Forms are arguably one of the most complex parts of building a web application. Managing state, handling validation, displaying error messages, and ensuring good performance can quickly turn into a messy tangle of code. After experimenting with various approaches—from controlled components to Formik—I’ve finally settled on what I consider the holy grail of React forms: **React Hook Form (RHF) combined with Zod**.

In this post, I''ll explain why this combination is so powerful and walk you through a practical implementation.

## What You''ll Learn
- The performance pitfalls of traditional controlled forms in React.
- How React Hook Form optimizes rendering.
- How to use Zod for schema-based, type-safe validation.
- A real-world example from my portfolio''s contact form.

## The Problem with Controlled Components

Traditionally, React forms are built using controlled components, where every input is tied to a piece of React state:

```tsx
const [email, setEmail] = useState('''');

return (
  <input
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
);
```

While simple for small forms, this approach scales poorly. Every keystroke triggers a state update, causing the entire component (and potentially its children) to re-render. If you have a complex form with a dozen fields and nested components, this constant re-rendering can lead to noticeable input lag.

## Enter React Hook Form

React Hook Form takes a different approach: uncontrolled components. It leverages React refs to track input values without triggering re-renders on every keystroke. The component only re-renders when necessary (e.g., when an error occurs or the form is submitted).

## Zod: The Perfect Validation Companion

While RHF has built-in validation, using a schema validation library like Zod takes it to the next level. Zod allows you to define your data schema once and automatically infers TypeScript types from it.

### A Practical Example

Here’s how I implemented the contact form on this very portfolio using this stack:

```tsx
import { useForm } from ''react-hook-form'';
import { zodResolver } from ''@hookform/resolvers/zod'';
import { z } from ''zod'';

// 1. Define the Zod schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

// Infer the TypeScript type from the schema
type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  // 2. Initialize RHF with the Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    // data is guaranteed to match the schema and type here!
    await submitToServer(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register("name")} placeholder="Your Name" />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      {/* other fields... */}

      <button disabled={isSubmitting}>Send</button>
    </form>
  );
}
```

## Common Mistakes and How to Avoid Them

- **Forgetting the Resolver**: You must install `@hookform/resolvers` and pass `zodResolver(schema)` to `useForm`. RHF won''t automatically know about your Zod schema otherwise.
- **Over-validating `onChange`**: By default, RHF validates on submit. If you switch the `mode` to `onChange`, you might lose some performance benefits. Usually, `onBlur` or the default `onSubmit` is better for UX and performance.
- **Not Leveraging Inferred Types**: Always use `z.infer<typeof schema>` instead of manually writing interfaces that might drift out of sync with your validation rules.

## Conclusion

Switching to React Hook Form and Zod has drastically reduced the boilerplate code in my projects while improving both type safety and performance. If you are still manually managing form state or using older libraries, I highly recommend giving this combination a try. It truly feels like the modern way to handle forms in React.

---
*Did this help? Share it on [Twitter/X](https://twitter.com/intent/tweet?text=Form%20Validation%20in%20React%3A%20Why%20I%20Switched%20to%20React%20Hook%20Form%20and%20Zod&url=https://jehadurre.me/blog/form-validation-react-hook-form-zod) or [connect with Jehad on LinkedIn](https://linkedin.com/in/jehadurre).*',
  '/blog/form-validation-react-hook-form-zod-cover.jpg',
  'Tools',
  ARRAY['react', 'typescript', 'forms', 'zod', 'performance'],
  CURRENT_DATE,
  4,
  true,
  'React Form Validation with React Hook Form and Zod',
  'Learn why combining React Hook Form with Zod is the best way to handle complex form validation and state in modern React applications.'
);
