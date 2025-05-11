import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Slider,
} from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useWorkoutAuth } from "@/hooks/useWorkoutAuth"
import { useNavigate } from "react-router-dom"

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Challenge name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  image_url: z.string().url({ message: "Invalid URL" }),
  start_date: z.date(),
  end_date: z.date(),
  condition_type: z.enum(["distance", "completion"]),
  condition_value: z.number().min(1, {
    message: "Condition value must be greater than 0.",
  }),
  condition_unit: z.enum(["km", "mi"]),
  is_active: z.boolean().default(true),
})

interface FormData extends z.infer<typeof FormSchema> {}

export default function CreateChallengeForm() {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const { getUserId } = useWorkoutAuth()
  const navigate = useNavigate()
  
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      image_url: "",
      start_date: new Date(),
      end_date: new Date(),
      condition_type: "distance",
      condition_value: 1,
      condition_unit: "km",
      is_active: true,
    },
  })
  
  useEffect(() => {
    if (form.formState.errors) {
      console.log(form.formState.errors)
    }
  }, [form.formState.errors])
  
  const handleSubmit = async (data: FormData) => {
    try {
      setSubmitting(true)
      
      // Validate dates
      if (data.start_date >= data.end_date) {
        toast({
          title: "Error",
          description: "Start date must be before end date.",
          variant: "destructive",
        })
        return
      }
      
      // Validate URL
      try {
        new URL(data.image_url)
      } catch (error) {
        toast({
          title: "Error",
          description: "Invalid image URL.",
          variant: "destructive",
        })
        return
      }
      
      // Fixed type specification to conform to the expected types
      const conditionType: "distance" | "completion" = data.condition_type as "distance" | "completion";
      // Fixed type specification to conform to the expected types
      const conditionUnit: "km" | "mi" = data.condition_unit as "km" | "mi";
      
      const newChallenge = {
        ...data,
        condition_type: conditionType,
        condition_unit: conditionUnit,
        creator_id: getUserId(),
      }
      
      const { error } = await supabase
        .from("challenges")
        .insert([newChallenge])
      
      if (error) {
        toast({
          title: "Error",
          description: `Failed to create challenge: ${error.message}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Challenge created successfully!",
        })
        navigate("/app/challenges")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to create challenge: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Challenge</CardTitle>
        <CardDescription>Fill in the details below to create a new challenge.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Challenge Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name of the challenge" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the challenge"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="URL of the challenge image" type="url" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ? field.value.toISOString().split('T')[0] : ''} onChange={(e) => field.onChange(new Date(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ? field.value.toISOString().split('T')[0] : ''} onChange={(e) => field.onChange(new Date(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />
            
            <FormField
              control={form.control}
              name="condition_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a condition type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="completion">Completion</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.getValues("condition_type") === "distance" && (
              <>
                <FormField
                  control={form.control}
                  name="condition_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distance Value</FormLabel>
                      <FormControl>
                        <Slider
                          defaultValue={[field.value]}
                          max={100}
                          step={1}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormDescription>Set the distance value for the challenge.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="condition_unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distance Unit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="km">Kilometers (km)</SelectItem>
                          <SelectItem value="mi">Miles (mi)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            <Separator />
            
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      Set the challenge to active or inactive.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Challenge"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
