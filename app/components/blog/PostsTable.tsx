import { useTranslation } from "react-i18next";
import DateUtils from "~/utils/shared/DateUtils";
import { useState } from "react";
import { BlogPostWithDetails } from "~/modules/blog/db/blog.db.server";
import ButtonTertiary from "../ui/buttons/ButtonTertiary";
import InputSearch from "../ui/input/InputSearch";
import TableSimple from "../ui/tables/TableSimple";
import DateCell from "../ui/dates/DateCell";
import UrlUtils from "~/utils/app/UrlUtils";
import { useParams } from "@remix-run/react";

interface Props {
  blogPath: string;
  items: BlogPostWithDetails[];
}

export default function PostsTable({ blogPath, items }: Props) {
  const { t } = useTranslation();
  const params = useParams();

  const [searchInput, setSearchInput] = useState("");

  const filteredItems = () => {
    if (!items) {
      return [];
    }
    return items.filter(
      (f) =>
        DateUtils.dateYMDHMS(f.createdAt)?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.slug?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.title?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.description?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        DateUtils.dateYMDHMS(f.date).includes(searchInput.toUpperCase()) ||
        f.description?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.content?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.readingTime?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        (f.author?.firstName + " " + f.author?.lastName)?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.category?.name?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.tags
          .map((f) => f.tag)
          ?.toString()
          .toUpperCase()
          .includes(searchInput.toUpperCase())
    );
  };

  return (
    <div className="space-y-2">
      <InputSearch value={searchInput} setValue={setSearchInput} />
      <TableSimple
        items={filteredItems()}
        headers={[
          {
            name: "title",
            title: t("models.post.object"),
            className: "w-full",
            value: (item) => (
              <div className="flex flex-col">
                <div>
                  {item.title}{" "}
                  <span>
                    {item.published ? (
                      <span className="text-xs text-teal-500">{/* ({t("blog.published")}) */}</span>
                    ) : (
                      <span className="text-xs text-red-500">({t("blog.draft")})</span>
                    )}
                  </span>
                </div>
                <a href={blogPath + "/" + item.slug} target="_blank" rel="noreferrer" className="text-gray-400 underline">
                  {item.slug}
                </a>
              </div>
            ),
          },
          // {
          //   name: "category",
          //   title: t("models.post.category"),
          //   value: (item) => (
          //     <div className="flex flex-col">
          //       <div className="">
          //         <span className="font-medium">{item.category.name}</span>{" "}
          //         {item.readingTime && <span className="italic text-gray-400">({item.readingTime})</span>}
          //       </div>
          //       <PostTags items={item.tags} />
          //     </div>
          //   ),
          // },
          {
            name: "createdAt",
            title: t("shared.createdAt"),
            value: (item) => (
              <div>
                <DateCell date={item.createdAt} displays={["ymd"]} />
              </div>
            ),
          },
          {
            name: "author",
            title: t("models.post.author"),
            value: (item) => (
              <div className="flex flex-col">
                {item.author ? (
                  <div>
                    {item.author.firstName} {item.author.lastName}
                  </div>
                ) : (
                  <div className="text-xs italic text-gray-500 hover:underline">No author</div>
                )}
              </div>
            ),
          },
          {
            name: "actions",
            title: t("shared.actions"),
            value: (item) => (
              <div className="flex items-center space-x-2">
                <ButtonTertiary to={UrlUtils.getModulePath(params, "blog/" + item.id)}>{t("shared.edit")}</ButtonTertiary>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
