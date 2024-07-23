"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ALLOWED_MIME_TYPES, imageData, MAX_FILE_SIZE } from "@/lib/dataType";
import { Button } from "@nextui-org/button";
import { home } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function FormSection4({
  verified,
  pending,
  role,
}: {
  verified: home;
  pending: home;
  role: string;
}) {
  const [description1, setDescription1] = useState<string>(
    verified.description1 || "",
  );
  const [name, setName] = useState<string>(verified.name || "");
  const [address, setAddress] = useState<string>(verified.address || "");
  const [phone, setPhone] = useState<string>(verified.phone || "");
  const [email, setEmail] = useState<string>(verified.email || "");
  const [youtube, setYoutube] = useState<string>(verified.youtube || "");
  const [instagram, setInstagram] = useState<string>(verified.instagram || "");
  const [facebook, setFacebook] = useState<string>(verified.facebook || "");
  const [twitter, setTwitter] = useState<string>(verified.twitter || "");
  const [linkedin, setLinkedin] = useState<string>(verified.linkedin || "");
  const [image, setImage] = useState<imageData>();

  const [namePending, setNamePending] = useState<string>(pending.name || "");
  const [addressPending, setAddressPending] = useState<string>(
    pending.address || "",
  );
  const [phonePending, setPhonePending] = useState<string>(pending.phone || "");
  const [emailPending, setEmailPending] = useState<string>(pending.email || "");
  const [youtubePending, setYoutubePending] = useState<string>(
    pending.youtube || "",
  );
  const [instagramPending, setInstagramPending] = useState<string>(
    pending.instagram || "",
  );
  const [facebookPending, setFacebookPending] = useState<string>(
    pending.facebook || "",
  );
  const [twitterPending, setTwitterPending] = useState<string>(
    pending.twitter || "",
  );
  const [linkedinPending, setLinkedinPending] = useState<string>(
    pending.linkedin || "",
  );
  const [imagePending, setImagePending] = useState<imageData>();

  const [isPending, setIsPending] = useState<boolean>(false);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isAccepting, setIsAccepting] = useState<boolean>(false);
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    if (verified) {
      const fetchImage = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${verified.logo}`,
          );
          const blob = await response.blob();
          const file = new File([blob], verified.logo, { type: blob.type });

          setImage({
            image: file,
            name: verified.logo,
            display: `${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${verified.logo}`,
          });

          const resPending = await fetch(
            `${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${pending.logo}`,
          );
          const blobPending = await resPending.blob();
          const filePending = new File([blob], pending.logo, {
            type: blobPending.type,
          });

          setImagePending({
            image: filePending,
            name: pending.logo,
            display: `${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${pending.logo}`,
          });

          if (verified.logo !== pending.logo) {
            setIsPending(true);
          }

          if (verified.name !== pending.name) {
            setIsPending(true);
          }

          if (verified.address !== pending.address) {
            setIsPending(true);
          }

          if (verified.phone !== pending.phone) {
            setIsPending(true);
          }

          if (verified.email !== pending.email) {
            setIsPending(true);
          }

          if (verified.youtube !== pending.youtube) {
            setIsPending(true);
          }

          if (verified.instagram !== pending.instagram) {
            setIsPending(true);
          }

          if (verified.facebook !== pending.facebook) {
            setIsPending(true);
          }

          if (verified.twitter !== pending.twitter) {
            setIsPending(true);
          }

          if (verified.linkedin !== pending.linkedin) {
            setIsPending(true);
          }
        } catch (error) {
          console.error("Error fetching image:", error);
          setError("Failed to fetch image");
        } finally {
          setIsFetching(false);
        }
      };

      fetchImage();
    }
  }, [verified]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSaving(true);

    const formData = new FormData();

    if (!image?.image) {
      setError("Please upload an image");
      setIsSaving(false);
      return;
    }

    if (!name || !address || !phone || !email) {
      setError("Please fill in all required fields");
      setIsSaving(false);
      return;
    }

    formData.append("logo", image?.image as File);
    formData.append("name", name);
    formData.append("address", address);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("youtube", youtube);
    formData.append("instagram", instagram);
    formData.append("facebook", facebook);
    formData.append("twitter", twitter);
    formData.append("linkedin", linkedin);

    try {
      // POST request to create a new text block
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/home/section4`,
        {
          method: "PUT",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("API Response Error:", errorResponse);
        throw new Error(
          `Network response was not ok: ${response.status} ${response.statusText}`,
        );
      }

      setIsSaving(false); // Set loading state to false
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      setIsSaving(false); // Set loading state to false
    }
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      // Validate MIME type
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setError("Invalid image type");
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds the maximum limit of 5MB.");
        return;
      }
      setImage((prevImage) => ({
        ...prevImage,
        image: file,
        name: file.name,
        display: URL.createObjectURL(file),
      }));
      setError("");
    } else {
      setError("No image chosen");
    }
  };

  const handleAccept = async () => {
    setIsAccepting(true);

  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/home/section4/accept`,
        {
          method: "PUT",
        },
      );
      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("API Response Error:", errorResponse);
        throw new Error(
          `Network response was not ok: ${response.status} ${response.statusText}`,
        );
      }
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/home/section4/reject`,
        {
          method: "PUT",
        },
      );
      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("API Response Error:", errorResponse);
        throw new Error(
          `Network response was not ok: ${response.status} ${response.statusText}`,
        );
      }
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="flex flex-col p-5 bg-white rounded-md shadow-sm">
      <p className="font-bold text-primaryBlue mb-4">
        Section 4{" "}
        <span className="text-sm font-normal text-gray-500">(footer)</span>
      </p>

      {isPending ? (
        <div className="w-full border-b-2 border-slate-300 mb-7 pb-7">
          <div className="flex flex-col w-full bg-slate-100 rounded-md p-5 mt-3">
            <p className="text-xs font-medium text-gray-500">Content Request</p>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex flex-col">
                <p className="font-semibold text-slate-500 text-sm">Company Name</p>
                <p>{namePending}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-slate-500 text-sm">Address</p>
                <p>{addressPending}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-slate-500 text-sm">Phone</p>
                <p>{phonePending}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-slate-500 text-sm">Email</p>
                <p>{emailPending}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-slate-500 text-sm">Youtube</p>
                <p>{youtubePending || "-"}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-slate-500 text-sm">Instagram</p>
                <p>{instagramPending || "-"}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-slate-500 text-sm">Facebook</p>
                <p>{facebookPending || "-"}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-slate-500 text-sm">Twitter</p>
                <p>{twitterPending || "-"}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-slate-500 text-sm">Linkedin</p>
                <p>{linkedinPending || "-"}</p>
              </div>
              
              <div className="flex flex-col">
                <p className="font-semibold text-slate-500 text-sm">Image</p>
                {imagePending?.display && (
                  <a
                    href={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${imagePending.name}`}
                    target="_blank"
                    className="w-fit h-fit"
                  >
                    <Image
                      src={imagePending?.display}
                      alt=""
                      width={200}
                      height={200}
                      className="rounded-md"
                    />
                  </a>
                )}
              </div>
            </div>
            <div className="space-x-5 self-end place-self-end ">
              <Button
                disabled={isSaving || isAccepting || isRejecting}
                className="px-[1rem] py-[0.5rem] border-1 border-primaryBlue bg-transparent rounded-[0.5rem]"
                onClick={handleReject}
              >
                {isRejecting
                  ? "Processing.."
                  : role === "admin"
                    ? "Reject"
                    : "Cancel"}
              </Button>
              {role === "admin" && (
                <Button
                  disabled={isSaving || isAccepting || isRejecting}
                  className="submit-btn"
                  onClick={handleAccept}
                >
                  {isAccepting ? "Accepting.." : "Accept"}
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {!isFetching ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col justify-center w-full">
                <label htmlFor="name" className="label text-sm">
                  Company Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="field"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="required"
                />
              </div>

              <div className="flex flex-col justify-center w-full">
                <label htmlFor="address" className="label text-sm">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  className="field"
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                  placeholder="required"
                />
              </div>

              <div className="flex flex-col justify-center w-full">
                <label htmlFor="phone" className="label text-sm">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  className="field"
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  placeholder="required"
                />
              </div>

              <div className="flex flex-col justify-center w-full">
                <label htmlFor="email" className="label text-sm">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  className="field"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="required"
                />
              </div>

              <div>
                <label htmlFor="logo" className="label text-sm">
                  Logo
                </label>
                <div className="field w-full flex flex-row items-center">
                  <span className="grow">
                    {image?.name ? image.name : "No image chosen"}
                  </span>
                  <input
                    type="file"
                    id="logo"
                    className="absolute opacity-0 cursor-pointer hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="logo"
                    className="hover:bg-sky-900 hover:cursor-pointer hover:text-white border-1 border-slate-400 px-3 text-sm rounded-lg items-center justify-center py-2  transition-all duration-300 ease-in-out"
                  >
                    choose a file
                  </label>
                </div>
              </div>
              {image?.display && (
                <div>
                  <a
                    href={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${image.name}`}
                    target="_blank"
                    className="w-fit h-fit"
                  >
                    <Image
                      src={image?.display}
                      alt=""
                      width={200}
                      height={200}
                      className="rounded-md"
                    />
                  </a>
                </div>
              )}

              <div className="border-1 border-slate-200 p-2 rounded-md space-y-5">
                <p className="text-sm font-semibold text-primaryBlue">
                  Social Media
                </p>
                <div className="flex flex-col justify-center w-full">
                  <label htmlFor="youtube" className="label text-sm">
                    Youtube
                  </label>
                  <input
                    type="text"
                    name="youtube"
                    className="field"
                    onChange={(e) => setYoutube(e.target.value)}
                    value={youtube}
                    placeholder="optional"
                  />
                </div>

                <div className="flex flex-col justify-center w-full">
                  <label htmlFor="instagram" className="label text-sm">
                    Instagram
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    className="field"
                    onChange={(e) => setInstagram(e.target.value)}
                    value={instagram}
                    placeholder="optional"
                  />
                </div>

                <div className="flex flex-col justify-center w-full">
                  <label htmlFor="facebook" className="label text-sm">
                    Facebook
                  </label>
                  <input
                    type="text"
                    name="facebook"
                    className="field"
                    onChange={(e) => setFacebook(e.target.value)}
                    value={facebook}
                    placeholder="optional"
                  />
                </div>

                <div className="flex flex-col justify-center w-full">
                  <label htmlFor="twitter" className="label text-sm">
                    Twitter
                  </label>
                  <input
                    type="text"
                    name="twitter"
                    className="field"
                    onChange={(e) => setTwitter(e.target.value)}
                    value={twitter}
                    placeholder="optional"
                  />
                </div>

                <div className="flex flex-col justify-center w-full">
                  <label htmlFor="linkedin" className="label text-sm">
                    Linkedin
                  </label>
                  <input
                    type="text"
                    name="linkedin"
                    className="field"
                    onChange={(e) => setLinkedin(e.target.value)}
                    value={linkedin}
                    placeholder="optional"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="submit-btn self-end mt-0 mr-2"
                disabled={isSaving || isAccepting || isRejecting}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
              {error ? (
                <p className="text-slate-500 text-sm mt-2 self-end pr-3">
                  {error}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="space-y-5">
              <Skeleton className="w-full h-10 rounded-lg bg-slate-200" />
              <Skeleton className="w-full h-28 rounded-lg bg-slate-200" />
              <Skeleton className="w-full h-10 rounded-lg bg-slate-200" />
            </div>
          )}
        </form>
      )}
    </div>
  );
}
